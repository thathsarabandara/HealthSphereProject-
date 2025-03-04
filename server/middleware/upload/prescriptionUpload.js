const multer = require('multer');
const fs = require('fs').promises; // Promise-based fs API
const path = require('path');

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const patientId = req.params.patientid;
    const reservationId = req.params.reservationid;

    if (!patientId || !reservationId) {
      return cb(new Error('Patient ID and Reservation ID are required.'));
    }

    const dir = path.join('uploads', 'storage', 'patient', patientId, 'prescription', reservationId);

    try {
      // Ensure the directory exists
      await fs.mkdir(dir, { recursive: true });
      cb(null, dir);
    } catch (err) {
      cb(new Error('Failed to create directory: ' + err.message));
    }
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const uniqueFilename = `prescription_${timestamp}${ext}`;
    cb(null, uniqueFilename); // Generate a unique filename
  },
});

// Multer Setup
const upload = multer({
  storage,
  limits: { fileSize: 6 * 1024 * 1024 }, // Max file size 2MB
  fileFilter: (req, file, cb) => {
    // Allow only image and PDF files
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only image and PDF files are allowed!'));
    }
    cb(null, true);
  },
});

// Middleware to Handle File Upload
const prescriptionUpload = (req, res, next) => {
  const uploadSingle = upload.single('prescriptionFile'); // Field name: 'prescriptionFile'

  uploadSingle(req, res, (err) => {
    if (err) {
        console.log(err)
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) {
      console.log('No file uploaded.');
      req.filePath = null; // No file uploaded
    } else {
      req.filePath = req.file.filename // Full file path
    }
    next();
  });
};

module.exports = {
  prescriptionUpload,
};
