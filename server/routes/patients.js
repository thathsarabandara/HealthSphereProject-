const express = require('express');
const router = express.Router();
const loginController =  require('../controllers/Patients/loginController');
const registerController =  require('../controllers/Patients/registerController');
const cartController =  require('../controllers/Patients/cartController');
const homeController =  require('../controllers/Patients/homeController');
const paymentController =  require('../controllers/Patients/paymentController');
const prescriptionController =  require('../controllers/Patients/prescriptionController');
const profileController =  require('../controllers/Patients/profileController');
const searchController =  require('../controllers/Patients/searchController');
const reservationController =  require('../controllers/Patients/reservationController');
const conditionsController =  require('../controllers/Patients/conditionController');
const doctorProfileController =  require('../controllers/Patients/doctorProfileController');
const reviewController =  require('../controllers/Patients/reviewController');
const authMiddleware = require('../middleware/auth/authenticateJWT');
const {authorizeRole} = require('../middleware/auth/authorizeRole');
const {rateLimiterMiddleware} = require('../middleware/rateLimit/rateLimiter');
const { profilePictureUpload } = require('../middleware/upload/profilePictureUpload');
const { bankReciptUpload } = require('../middleware/upload/banksReciptUpload');

router.get('/', rateLimiterMiddleware ,homeController.authHome );
router.get('/finddoctor', rateLimiterMiddleware);
router.get('/bookings/:reservationId/payment/:amount', rateLimiterMiddleware, paymentController.makePaymentId);
router.post('/finddoctor', rateLimiterMiddleware, searchController.searchDoctors);
router.get('/finddoctor/:specialization', rateLimiterMiddleware, searchController.loadDoctors);
router.get('/reservation',rateLimiterMiddleware,reservationController.loadUserData);
router.get('/doctorprofile/:doctorid',rateLimiterMiddleware,doctorProfileController.loadDoctorProfile);
router.post('/doctorprofile/:doctorid/addreview',rateLimiterMiddleware,reviewController.addReview);
router.post('/reservation/:id',rateLimiterMiddleware,reservationController.saveReservation);
router.get('/cancelreservation/:id',rateLimiterMiddleware,reservationController.cancelReservation);
router.get('/reservations/all',rateLimiterMiddleware,reservationController.loadReservations);
router.get('/finddoctor/:specialization/:doctor',[authMiddleware , authorizeRole('patient'),rateLimiterMiddleware]);
router.post('/package/:id',[authMiddleware , authorizeRole('patient'),rateLimiterMiddleware],cartController.addItems);
router.get('/pharamacy',[authMiddleware , authorizeRole('patient'),rateLimiterMiddleware]);
router.get('/labratory',[authMiddleware,authorizeRole('patient'),rateLimiterMiddleware]);
router.get('/allergies', [rateLimiterMiddleware], conditionsController.getAllergies);
router.post('/allergies', [rateLimiterMiddleware], conditionsController.createAllergy);
router.put('/allergies', [rateLimiterMiddleware], conditionsController.deleteAllergy);

router.get('/bloodSugar', [rateLimiterMiddleware], conditionsController.getBloodSugar);
router.post('/bloodSugar', [rateLimiterMiddleware], conditionsController.createBloodSugar);
router.put('/bloodSugar', [rateLimiterMiddleware], conditionsController.deleteBloodSugar);

router.get('/bmi', [rateLimiterMiddleware], conditionsController.getBmi);
router.post('/bmi', [rateLimiterMiddleware], conditionsController.createBmi);
router.put('/bmi', [rateLimiterMiddleware], conditionsController.deleteBmi);

router.get('/conditions', [rateLimiterMiddleware], conditionsController.getConditions);
router.post('/conditions', [rateLimiterMiddleware], conditionsController.createCondition);
router.put('/conditions', [rateLimiterMiddleware], conditionsController.deleteCondition);

router.get('/heartRates', [rateLimiterMiddleware], conditionsController.getHeartRates);
router.post('/heartRates', [rateLimiterMiddleware], conditionsController.createHeartRate);
router.put('/heartRates', [rateLimiterMiddleware], conditionsController.deleteHeartRate);

router.get('/aboutus',rateLimiterMiddleware);
router.get('/userprofile',[authMiddleware ,authorizeRole('patient'), rateLimiterMiddleware],profileController.profileLoad);
router.put('/userprofile/:id',profilePictureUpload,profileController.saveProfile);
router.get('/userprescription',[authMiddleware , authorizeRole('patient'),rateLimiterMiddleware],prescriptionController.loadPrescriptionDetails);
router.get('/userpayments',[authMiddleware , authorizeRole('patient'),rateLimiterMiddleware], paymentController.loadPayment);
router.get('/cart',[authMiddleware , authorizeRole('patient'),rateLimiterMiddleware], cartController.loadCart);
router.put('/cart/:id',[authMiddleware , authorizeRole('patient'),rateLimiterMiddleware], cartController.deleteCartItem);
router.post('/checkout/amount/:amount',rateLimiterMiddleware,paymentController.makeCheckout);
router.get('/checkout/:id',rateLimiterMiddleware,paymentController.loadCheckout);
router.post('/checkout/pay/:id',[bankReciptUpload , rateLimiterMiddleware],paymentController.makePayment);
router.get('/refund',[authMiddleware , authorizeRole('patient'),rateLimiterMiddleware],paymentController.loadRefund);
router.get('/refund/request',[authMiddleware , authorizeRole('patient'),rateLimiterMiddleware]);
router.post('/resetpassword',rateLimiterMiddleware,loginController.resetPassword);
router.get('/resetpassword/validate',rateLimiterMiddleware,loginController.validateToken);
router.post('/resetpasswordRequest',rateLimiterMiddleware, loginController.resetPasswordRequest);
router.post('/logout',rateLimiterMiddleware, loginController.logout);
router.post('/verifyuser',rateLimiterMiddleware, registerController.verifyUser );
router.get('/resendotp',rateLimiterMiddleware, registerController.resendOTP);
router.post('/register',rateLimiterMiddleware,registerController.register);
router.post('/login',rateLimiterMiddleware,loginController.login);


module.exports = router;
