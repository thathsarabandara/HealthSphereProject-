const express = require('express');
const router = express.Router();
const adminLoginController = require('../controllers/Admins/adminLoginController');
const scheduleController = require('../controllers/Admins/scheduleController');
const adminAuthMiddleware = require('../middleware/auth/authorizeAdmin');
const patientmanagement  = require('../controllers/Admins/patientmanagementcontroller');

// Admin Authentication Routes
router.post('/login', adminLoginController.login);
router.post('/logout', adminLoginController.logout);

// Schedule Management Routes
router.get('/schedules', scheduleController.getScheduleRequest);
router.post('/acceptschedule/:id',scheduleController.makeAcceptScheduleRequest);
router.post('/rejectschedule/:id',scheduleController.makeRejectScheduleRequest);

// Admin Dashboard (You need a controller function for dashboard)
// router.get('/admin/dashboard', adminAuthMiddleware);

// // Manage Patients (You need a controller function for managing patients)
router.put('/patientmanagement',adminAuthMiddleware, patientmanagement.saveProfile);
router.get('/patientmanagement/viewpatient',adminAuthMiddleware, patientmanagement.patientDetails);
router.get('/patientmanagement/viewdoctor/:id',adminAuthMiddleware, patientmanagement.loadDoctortProfile);
router.get('/patientmanagement/loadprescription/:reservationid',adminAuthMiddleware, patientmanagement.loadPrescription);

// // Refund Management (You need a controller function for handling refunds)
// router.get('/admin/refund', adminAuthMiddleware);

module.exports = router;
