const { copySync } = require('fs-extra');
const multer = require('multer');
const fs = require('fs').promises;  // Use the promise-based fs API
const path = require('path');

// Define Multer Storage Configuration
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const id = req.params.id;
    const dir = path.join('uploads', 'storage', 'patient', id , 'profilepictures');

    try {
      // Ensure the directory exists (create if it doesn't exist)
      await fs.mkdir(dir, { recursive: true });
      cb(null, dir);  // Pass the directory to Multer
    } catch (err) {
      cb(new Error('Directory creation failed: ' + err.message));
    }
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const uniqueFilename = `profile_${timestamp}${ext}`;
    cb(null, uniqueFilename); // Generate a unique filename
  },
});

// Multer Setup (File Size, Type Validation)
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },  // Max file size 2MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);  // Accept file
  },
});

// Middleware to Handle Profile Picture Upload
const profilePictureUpload = (req, res, next) => {
  const uploadSingle = upload.single('profilePicture');  // The field name 'profilePicture' must match with the frontend form input name
  
  uploadSingle(req, res, function (err) {
    if (err) {
      // If error occurs, send the error message back to client
      return res.status(400).json({ error: err.message });
    }

    if (req.file) {
      // If file is uploaded successfully, save the file path to req.filePath
      req.profile_picture = req.file.filename;
      return next();  // Continue with the next middleware (or send response here)
    } else {
      return res.status(400).json({ error: 'No file uploaded' });
    }
  });
};

module.exports = {
  profilePictureUpload
};
