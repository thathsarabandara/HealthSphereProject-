const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth/authenticateJWT');
const { authorizeRole } = require('../middleware/auth/authorizeRole');
const { rateLimiterMiddleware } = require('../middleware/rateLimit/rateLimiter');
const { doctorFileHandleMiddleware } = require('../middleware/upload/doctorFileHandling');
const loginController =  require('../controllers/Doctors/loginController');
const registerController =  require('../controllers/Doctors/registerController');



router.get('/',rateLimiterMiddleware,);
router.get('/aboutus',rateLimiterMiddleware,);
router.get('/schedule',[authMiddleware , authorizeRole('doctor'),rateLimiterMiddleware]);
router.get('/videoconsultation',[authMiddleware , authorizeRole('doctor'),rateLimiterMiddleware]);
router.get('/clinic',[authMiddleware , authorizeRole('doctor'),rateLimiterMiddleware]);
router.get('/clinic/patientprofile',[authMiddleware , authorizeRole('doctor'),rateLimiterMiddleware]);
router.get('/clinic/prescription',[authMiddleware , authorizeRole('doctor'),rateLimiterMiddleware]);
router.get('/login',rateLimiterMiddleware);
router.post('/register',rateLimiterMiddleware,registerController.register);
router.post('/verifyuser',rateLimiterMiddleware,registerController.verifyUser);
router.get('/resendotp',rateLimiterMiddleware, registerController.resendOTP);
router.post('/fullregister/:id',[ doctorFileHandleMiddleware, rateLimiterMiddleware],registerController.saveProfileDetails);


module.exports = router;
