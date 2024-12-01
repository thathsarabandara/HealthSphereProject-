const multer = require('multer');
const fs = require('fs').promises; // Promise-based fs API
const path = require('path');
const { Token } = require('../../models/auth/Token');
const { Patient } = require('../../models/healthcare/Patient');

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const { id } = req.params;  // Get both patientId and reservationId from request params
      const token = req.cookies['token'];

      // Step 1: Token Validation
      if (!token) {
        return cb(new Error('Authentication token is missing'));
      }

      const tokenRecord = await Token.findOne({
        where: {
          token,
          expires_at: { [Op.gt]: new Date() }, // Ensure token is valid
        },
      });

      if (!tokenRecord) {
        return cb(new Error('Invalid or expired token'));
      }

      // Step 2: Retrieve the patient associated with the token
      const patient = await Patient.findOne({ where: { user_id: tokenRecord.user_id } });
      if (!patient) {
        return cb(new Error('Patient not found'));
      }

      const patientId = patient.id;

      if (!patientId) {
        return cb(new Error('Patient ID and Reservation ID are required.'));
      }

      // Step 3: Create the directory path for storing the uploaded file
      const dir = path.join('uploads', 'storage', 'patient', patientId, 'payment', id);

      // Ensure the directory exists or create it if it does not
      await fs.mkdir(dir, { recursive: true });
      cb(null, dir); // Proceed with file upload
    } catch (err) {
      cb(new Error('Failed to create directory: ' + err.message)); // Error handling if directory creation fails
    }
  },

  // Define the filename for the uploaded file
  filename: (req, file, cb) => {
    const timestamp = Date.now(); // Get the current timestamp
    const ext = path.extname(file.originalname); // Extract the file extension
    const uniqueFilename = `prescription_${timestamp}${ext}`; // Generate a unique filename based on the timestamp
    cb(null, uniqueFilename); // Pass the filename to multer
  },
});

// Multer setup for file upload
const upload = multer({
  storage,
  limits: { fileSize: 6 * 1024 * 1024 }, // Max file size 6MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf']; // Allowed file types
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only image and PDF files are allowed!'));
    }
    cb(null, true); // Accept the file
  },
});

// Middleware to handle the file upload
const bankReciptUpload = (req, res, next) => {
  const uploadSingle = upload.single('paymentProof'); // File field name: 'paymentProof'

  uploadSingle(req, res, (err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: err.message }); // Respond with error message if file upload fails
    }

    // Handle case where no file was uploaded
    if (!req.file) {
      console.log('No file uploaded.');
      req.filePath = null; // No file uploaded
    } else {
      req.bankrecipt = req.file.filename; // Set the filename of the uploaded file
    }
    
    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = {
  bankReciptUpload,
};
