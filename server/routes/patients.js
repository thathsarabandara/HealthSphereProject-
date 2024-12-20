const express = require('express');
const router = express.Router();
const loginController =  require('../controllers/Patients/loginController');
const registerController =  require('../controllers/Patients/registerController');
const cartController =  require('../controllers/Patients/cartController');
const homeController =  require('../controllers/Patients/homeController');
const paymentController =  require('../controllers/Patients/paymentController');
const refundController =  require('../controllers/Patients/refundController');
const prescriptionController =  require('../controllers/Patients/prescriptionController');
const profileController =  require('../controllers/Patients/profileController');
const searchController =  require('../controllers/Patients/searchController');
const reservationController =  require('../controllers/Patients/reservationController');
const conditionsController =  require('../controllers/Patients/conditionController');
const doctorProfileController =  require('../controllers/Patients/doctorProfileController');
const reviewController =  require('../controllers/Patients/reviewController');
const {patientAuthMiddleware} = require('../middleware/auth/authorizePatient');
const { profilePictureUpload } = require('../middleware/upload/profilePictureUpload');
const { bankReciptUpload } = require('../middleware/upload/banksReciptUpload');

router.get('/' ,patientAuthMiddleware, homeController.authHome );
router.post('/finddoctor', searchController.searchDoctors);
router.get('/finddoctor/:specialization',searchController.loadDoctors);
router.get('/bookings/:reservationId/payment', patientAuthMiddleware, paymentController.makePaymentId);
router.get('/reservation',patientAuthMiddleware,reservationController.loadUserData);
router.get('/doctorprofile/:doctorid',patientAuthMiddleware,doctorProfileController.loadDoctorProfile);
router.post('/doctorprofile/:doctorid/addreview',patientAuthMiddleware,reviewController.addReview);
router.post('/reservation/:id',patientAuthMiddleware,reservationController.saveReservation);
router.get('/cancelreservation/:id',patientAuthMiddleware,reservationController.cancelReservation);
router.get('/reservations/all',patientAuthMiddleware,reservationController.loadReservations);
router.get('/finddoctor/:specialization/:doctor',patientAuthMiddleware);
router.post('/package/:id',patientAuthMiddleware,cartController.addItems);
router.get('/pharamacy',patientAuthMiddleware);
router.get('/labratory',patientAuthMiddleware );
router.get('/allergies', patientAuthMiddleware, conditionsController.getAllergies);
router.post('/allergies', patientAuthMiddleware, conditionsController.createAllergy);
router.put('/allergies', patientAuthMiddleware, conditionsController.deleteAllergy);

router.get('/bloodSugar',patientAuthMiddleware, conditionsController.getBloodSugar);
router.post('/bloodSugar',patientAuthMiddleware, conditionsController.createBloodSugar);
router.put('/bloodSugar',patientAuthMiddleware, conditionsController.deleteBloodSugar);

router.get('/bmi',patientAuthMiddleware, conditionsController.getBmi);
router.post('/bmi',patientAuthMiddleware, conditionsController.createBmi);
router.put('/bmi',patientAuthMiddleware, conditionsController.deleteBmi);

router.get('/conditions',patientAuthMiddleware, conditionsController.getConditions);
router.post('/conditions',patientAuthMiddleware, conditionsController.createCondition);
router.put('/conditions',patientAuthMiddleware, conditionsController.deleteCondition);

router.get('/heartRates',patientAuthMiddleware, conditionsController.getHeartRates);
router.post('/heartRates',patientAuthMiddleware, conditionsController.createHeartRate);
router.put('/heartRates',patientAuthMiddleware, conditionsController.deleteHeartRate);
 
router.get('/userprofile', patientAuthMiddleware,profileController.profileLoad);
router.put('/userprofile/:id',[profilePictureUpload],profileController.saveProfile);
router.get('/userprescription',patientAuthMiddleware,prescriptionController.loadPrescriptionDetails);
router.get('/prescription/:reservationid',patientAuthMiddleware,prescriptionController.loadPrescription);
router.get('/userpayments',patientAuthMiddleware, paymentController.loadPayment);
router.get('/cart',patientAuthMiddleware, cartController.loadCart);
router.put('/cart/:id',patientAuthMiddleware, cartController.deleteCartItem);
router.post('/checkout/amount/:amount',patientAuthMiddleware,paymentController.makeCheckout);
router.get('/checkout/:id',patientAuthMiddleware,paymentController.loadCheckout);
router.post('/checkout/pay/:id',[bankReciptUpload , patientAuthMiddleware],paymentController.makePayment);
router.post('/checkouts/pay/:id',[bankReciptUpload , patientAuthMiddleware],paymentController.makePayments);
router.get('/refund',patientAuthMiddleware,refundController.loadRefunds);
router.post('/refund/request',patientAuthMiddleware, refundController.makeRefunds);
router.post('/resetpassword',loginController.resetPassword);
router.get('/resetpassword/validate',loginController.validateToken);
router.post('/resetpasswordRequest', loginController.resetPasswordRequest);
router.post('/logout',patientAuthMiddleware, loginController.logout);
router.post('/verifyuser', registerController.verifyUser );
router.get('/resendotp', registerController.resendOTP);
router.post('/register',registerController.register);
router.post('/login',loginController.login);


module.exports = router;
