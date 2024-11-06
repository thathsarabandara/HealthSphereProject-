const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        const patientId = req.body.patient_id;
        const dir = `uploads/patient/${patientId}/profile_pictures`;

        fs.mkdir(dir, {recursive:true});
        cb(null, dir);
    },
    filename: function(req,file,cb){
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        const uniqueFileName = `profile_${timestamp}${ext}`;

        cb(null, uniqueFileName);
    },
});

const uploads = multer({
    limits: {fileSize: 2*1024*1024},
    fileFilter: (req,file,cb)=>{
        if(!file.mimetype.startsWith('image/')){
            returncb(new Error('Only images are allowed!'), false);
        }
        cb(null,true);
    },
})
const profilePictureUpload = (req, res, next) => {
    const uploadSingle = uploads.single('profilePicture');
    
    uploadSingle(req, res, function (err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
  
      // Check if file was uploaded successfully
      if (req.file) {
        req.filePath = req.file.path; // Pass file path to the controller
        next();
      } else {
        res.status(400).json({ error: 'No file uploaded' });
      }
    });
  };

  module.exports = {profilePictureUpload};