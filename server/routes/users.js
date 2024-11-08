const express = require('express');
const router = express.Router();
const userAuthController =  require('../controllers/Patients/userAuthController');
const userController =  require('../controllers/Patients/userController');
const authMiddleware = require('../middleware/auth/authenticateJWT');
const {authorizeRole} = require('../middleware/auth/authorizeRole');
const {rateLimiterMiddleware} = require('../middleware/rateLimit/rateLimiter')

router.get('/', rateLimiterMiddleware ,userController.authHome );
router.get('/finddoctor', rateLimiterMiddleware);
router.post('/finddoctor', rateLimiterMiddleware, userController.searchDoctors);
router.get('/finddoctor/:specialization', rateLimiterMiddleware, userController.loadDoctors);
router.get('/finddoctor/:specialization/reservation',[authMiddleware , authorizeRole('user'),rateLimiterMiddleware]);
router.get('/finddoctor/:specialization/:doctor',[authMiddleware , authorizeRole('user'),rateLimiterMiddleware]);
router.get('/package',[authMiddleware , authorizeRole('user'),rateLimiterMiddleware]);
router.get('/pharamacy',[authMiddleware , authorizeRole('user'),rateLimiterMiddleware]);
router.get('/labratory',[authMiddleware , authorizeRole('user'),rateLimiterMiddleware]);
router.get('/aboutus',rateLimiterMiddleware);
router.get('/userprofile',[authMiddleware , authorizeRole('user'),rateLimiterMiddleware]);
router.get('/userprescription',[authMiddleware , authorizeRole('user'),rateLimiterMiddleware]);
router.get('/userpayments',[authMiddleware , authorizeRole('user'),rateLimiterMiddleware]);
router.get('/cart',[authMiddleware , authorizeRole('user'),rateLimiterMiddleware]);
router.get('/checkout',[authMiddleware , authorizeRole('user'),rateLimiterMiddleware]);
router.get('/refund',[authMiddleware , authorizeRole('user'),rateLimiterMiddleware]);
router.get('/refund/request',[authMiddleware , authorizeRole('user'),rateLimiterMiddleware]);
router.post('/resetpassword',rateLimiterMiddleware,userAuthController.resetPassword);
router.get('/resetpassword/validate',rateLimiterMiddleware,userAuthController.validateToken);
router.post('/resetpasswordRequest',rateLimiterMiddleware, userAuthController.resetPasswordRequest);
router.post('/logout',rateLimiterMiddleware, userAuthController.logout);
router.post('/verifyuser',rateLimiterMiddleware, userAuthController.verifyUser );
router.get('/resendotp',rateLimiterMiddleware, userAuthController.resendOTP);
router.post('/register',rateLimiterMiddleware,userAuthController.register);
router.post('/login',rateLimiterMiddleware,userAuthController.login);


module.exports = router;
