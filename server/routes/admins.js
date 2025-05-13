const express = require('express');
const router = express.Router();
const adminLoginController = require('../controllers/Admins/adminLoginController');
const scheduleController = require('../controllers/Admins/scheduleController');
const {adminAuthMiddleware} = require('../middleware/auth/authorizeAdmin');
const patientmanagement  = require('../controllers/Admins/patientmanagementcontroller');
const staffManagement = require('../controllers/Admins/staffManagementController');

// Admin Authentication Routes
router.post('/login', adminLoginController.login);
router.post('/logout', adminLoginController.logout);

// Schedule Management Routes
router.get('/schedules', scheduleController.getScheduleRequest);
router.post('/acceptschedule/:id',scheduleController.makeAcceptScheduleRequest);
router.post('/rejectschedule/:id',scheduleController.makeRejectScheduleRequest);

// Admin Dashboard (You need a controller function for dashboard)
// router.get('/admin/dashboard', adminAuthMiddleware);

// Patient Management Routes
router.put('/patientmanagement', adminAuthMiddleware, patientmanagement.saveProfile);
router.get('/patientmanagement/viewpatient', adminAuthMiddleware, patientmanagement.patientDetails);
router.get('/patientmanagement/viewdoctor/:id', adminAuthMiddleware, patientmanagement.loadDoctortProfile);
router.get('/patientmanagement/loadprescription/:reservationid', adminAuthMiddleware, patientmanagement.loadPrescription);

// Staff Management Routes
router.get('/staff/requests', adminAuthMiddleware, staffManagement.getSignupRequests);
router.get('/staff/counts', adminAuthMiddleware, staffManagement.getStaffCounts);
router.get('/staff', adminAuthMiddleware, staffManagement.getAllStaff);
router.put('/staff/:userId/status', adminAuthMiddleware, staffManagement.updateStaffStatus);

// // Refund Management (You need a controller function for handling refunds)
// router.get('/admin/refund', adminAuthMiddleware);

module.exports = router;
