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

const profilePictureUpload = (req, res, next) => {
  const uploadSingle = upload.single('profilePicture');

  uploadSingle(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) {
      console.log("No file uploaded.");
      req.profile_picture = null; 
    } else {
      req.profile_picture = req.file.filename;
    }
    next();  
  });
};



module.exports = {
  profilePictureUpload
};
