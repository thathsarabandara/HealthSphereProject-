const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const patientId = req.params.patientId;
    const dir = `uploads/patients/${patientId}/profile_pictures/`;

    // Ensure the directory exists
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const uniqueFilename = `profile_${timestamp}${ext}`;

    cb(null, uniqueFilename); 
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only images are allowed!'), false);
    }
    cb(null, true);
  },
});


const profilePictureUpload = (req, res, next) => {
  const uploadSingle = upload.single('profilePicture');
  
  uploadSingle(req, res, function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    
    if (req.file) {
      req.filePath = req.file.path; 
      next();
    } else {
      res.status(400).json({ error: 'No file uploaded' });
    }
  });
};

module.exports = profilePictureUpload;
