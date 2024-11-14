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
router.get('/finddoctor/:specialization/reservation',[authMiddleware , authorizeRole('patient'),rateLimiterMiddleware]);
router.get('/finddoctor/:specialization/:doctor',[authMiddleware , authorizeRole('patient'),rateLimiterMiddleware]);
router.post('/package/:id',[authMiddleware , authorizeRole('patient'),rateLimiterMiddleware],userController.addItems);
router.get('/pharamacy',[authMiddleware , authorizeRole('patient'),rateLimiterMiddleware]);
router.get('/labratory',[authMiddleware , authorizeRole('patient'),rateLimiterMiddleware]);
router.get('/aboutus',rateLimiterMiddleware);
router.get('/userprofile',[authMiddleware ,authorizeRole('patient'), rateLimiterMiddleware],userController.profileLoad);
router.put('/userprofile',[authMiddleware , authorizeRole('patient'),rateLimiterMiddleware],userController.saveProfile);
router.get('/userprescription',[authMiddleware , authorizeRole('patient'),rateLimiterMiddleware],userController.loadPrescription);
router.get('/userpayments',[authMiddleware , authorizeRole('patient'),rateLimiterMiddleware], userController.loadPayment);
router.get('/cart',[authMiddleware , authorizeRole('patient'),rateLimiterMiddleware], userController.loadCart);
router.put('/cart/:id', userController.deleteCartItem);
router.get('/checkout',[authMiddleware , authorizeRole('patient'),rateLimiterMiddleware],userController.loadCheckout);
router.get('/refund',[authMiddleware , authorizeRole('patient'),rateLimiterMiddleware],userController.loadRefund);
router.get('/refund/request',[authMiddleware , authorizeRole('patient'),rateLimiterMiddleware]);
router.post('/resetpassword',rateLimiterMiddleware,userAuthController.resetPassword);
router.get('/resetpassword/validate',rateLimiterMiddleware,userAuthController.validateToken);
router.post('/resetpasswordRequest',rateLimiterMiddleware, userAuthController.resetPasswordRequest);
router.post('/logout',rateLimiterMiddleware, userAuthController.logout);
router.post('/verifyuser',rateLimiterMiddleware, userAuthController.verifyUser );
router.get('/resendotp',rateLimiterMiddleware, userAuthController.resendOTP);
router.post('/register',rateLimiterMiddleware,userAuthController.register);
router.post('/login',rateLimiterMiddleware,userAuthController.login);


module.exports = router;
