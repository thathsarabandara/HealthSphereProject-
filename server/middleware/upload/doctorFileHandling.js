const multer = require('multer');
const fs = require('fs').promises; // Use the promise-based fs API
const path = require('path');

// Define Multer Storage Configuration
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const id = req.params.id; // Get the doctor's ID from the URL params
    const dir = path.join('uploads', 'storage', 'doctor', id, 'profiledocuments');

    try {
      // Ensure the directory exists (create it if it doesn't exist)
      await fs.mkdir(dir, { recursive: true });
      cb(null, dir); // Pass the directory to Multer
    } catch (err) {
      console.error('Directory creation failed:', err);
      cb(new Error('Directory creation failed: ' + err.message));
    }
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now(); // Add timestamp to the filename to ensure uniqueness
    const ext = path.extname(file.originalname); // Get file extension
    const uniqueFilename = `${file.fieldname}_${timestamp}${ext}`; // Generate unique filename
    cb(null, uniqueFilename); // Provide the unique filename to Multer
  },
});

// Multer Setup (File Size, Type Validation)
const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // Max file size 2MB
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/', 'application/pdf']; // Allow images and PDFs (you can add more if needed)
    if (!allowedMimeTypes.some(type => file.mimetype.startsWith(type))) {
      console.log('Invalid file type:', file.mimetype);
      return cb(new Error('Only image and PDF files are allowed!'), false);
    }
    cb(null, true); // Accept file
  },
});

// Middleware to handle multiple file uploads
const doctorFileHandleMiddleware = (req, res, next) => {

  const uploadFields = upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'nationalId', maxCount: 1 },
    { name: 'medicalLicenseDoc', maxCount: 1 },
  ]);

  // Upload the files
  uploadFields(req, res, (err) => {
    if (err) {
      console.error('Error during file upload:', err);
      return res.status(400).json({ error: err.message }); // Return error if file upload fails
    }


    // If files are uploaded correctly, map them to req.uploadedFiles
    req.uploadedFiles = {
      profile_picture: req.files?.profilePicture?.[0]?.filename || null, // Check if file exists
      national_id: req.files?.nationalId?.[0]?.filename || null, // Ensure file is correctly assigned
      medical_license: req.files?.medicalLicenseDoc?.[0]?.filename || null, // Ensure file is correctly assigned
    };

    next(); // Proceed to the next middleware/route handler
  });
};

module.exports = {
  doctorFileHandleMiddleware,
};
