const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth/authenticateJWT');
const { authorizeRole } = require('../middleware/auth/authorizeRole');
const { rateLimiterMiddleware } = require('../middleware/rateLimit/rateLimiter');
const { doctorFileHandleMiddleware } = require('../middleware/upload/doctorFileHandling');
const { prescriptionUpload } = require('../middleware/upload/prescriptionUpload');
const loginController =  require('../controllers/Doctors/loginController');
const registerController =  require('../controllers/Doctors/registerController');
const homeController =  require('../controllers/Doctors/homeController');
const scheduleController =  require('../controllers/Doctors/scheduleController');
const patientProfileController =  require('../controllers/Doctors/patientProfileController');
const clinicController =  require('../controllers/Doctors/clinicController');



router.get('/',rateLimiterMiddleware, homeController.authHome);
router.get('/schedule',scheduleController.loadSchedules);
router.post('/schedule',scheduleController.saveSchedules);
router.get('/patientprofile/:id',patientProfileController.loadPatientProfile);
router.get('/videoconsultation',[authMiddleware , authorizeRole('doctor'),rateLimiterMiddleware]);
router.get('/clinic',[rateLimiterMiddleware], clinicController.loadClinics);
router.get('/pastclinic',[rateLimiterMiddleware], clinicController.loadPastClinics);
router.get('/prescription/:reservationid/:patientid',[rateLimiterMiddleware], clinicController.loadPrescription);
router.post('/clinic/:reservationid/prescription/:patientid',[prescriptionUpload,rateLimiterMiddleware], clinicController.savePrescription);
router.post('/resetpassword',rateLimiterMiddleware,loginController.resetPassword);
router.get('/resetpassword/validate',rateLimiterMiddleware,loginController.validateToken);
router.post('/resetpasswordRequest',rateLimiterMiddleware, loginController.resetPasswordRequest);
router.post('/logout',rateLimiterMiddleware, loginController.logout);
router.post('/login',rateLimiterMiddleware,loginController.login);
router.post('/register',rateLimiterMiddleware,registerController.register);
router.post('/verifyuser',rateLimiterMiddleware,registerController.verifyUser);
router.get('/resendotp',rateLimiterMiddleware, registerController.resendOTP);
router.post('/fullregister/:id',[ doctorFileHandleMiddleware, rateLimiterMiddleware],registerController.saveProfileDetails);


module.exports = router;
