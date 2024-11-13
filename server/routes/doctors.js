const express = require('express');
const authMiddleware = require('../middleware/auth/authenticateJWT');
const { authorizeRole } = require('../middleware/auth/authorizeRole');
const { rateLimiterMiddleware } = require('../middleware/rateLimit/rateLimiter');
const doctorAuthController =  require('../controllers/Doctors/doctorAuthController');
const doctorController =  require('../controllers/Doctors/doctorController');
const router = express.Router();


router.get('/',rateLimiterMiddleware,doctorController);
router.get('/aboutus',rateLimiterMiddleware,);
router.get('/schedule',[authMiddleware , authorizeRole('doctor'),rateLimiterMiddleware]);
router.get('/videoconsultation',[authMiddleware , authorizeRole('doctor'),rateLimiterMiddleware]);
router.get('/clinic',[authMiddleware , authorizeRole('doctor'),rateLimiterMiddleware]);
router.get('/clinic/patientprofile',[authMiddleware , authorizeRole('doctor'),rateLimiterMiddleware]);
router.get('/clinic/prescription',[authMiddleware , authorizeRole('doctor'),rateLimiterMiddleware]);
router.get('/login',rateLimiterMiddleware,doctorAuthController.login);
router.post('/register',rateLimiterMiddleware,doctorAuthController.register);
router.post('/fullregister',rateLimiterMiddleware,);


module.exports = router;
