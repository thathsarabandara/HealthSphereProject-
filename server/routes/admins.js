const express = require("express");
const router = express.Router();
const adminLoginController = require("../controllers/Admins/adminLoginController");
const scheduleController = require("../controllers/Admins/scheduleController");
const adminAuthMiddleware = require("../middleware/auth/authorizeAdmin");
const patientmanagement = require("../controllers/Admins/patientmanagementcontroller");
const {
  profilePictureUpload,
} = require("../middleware/upload/profilePictureUpload");
const doctorAndStaffManagementController = require("../controllers/Admins/doctorAndStaffManagementController");

// Admin Authentication Routes
router.post("/login", adminLoginController.login);
router.post("/logout", adminLoginController.logout);

// Schedule Management Routes
router.get("/schedules", scheduleController.getScheduleRequest);
router.post(
  "/acceptschedule/:id",
  scheduleController.makeAcceptScheduleRequest
);
router.post(
  "/rejectschedule/:id",
  scheduleController.makeRejectScheduleRequest
);

// Admin Dashboard (You need a controller function for dashboard)
// router.get('/admin/dashboard', adminAuthMiddleware);

// Manage Patients
router.put("/patientmanagement", patientmanagement.saveProfile);
router.put(
  "/patientmanagement/upload-profile-picture/:id",
  profilePictureUpload,
  patientmanagement.uploadPatientProfilePicture
);
router.get("/patientmanagement/viewpatient", patientmanagement.patientDetails);
// router.get(
//   "/patientmanagement/viewdoctor/:id",adminAuthMiddleware,
//   patientmanagement.loadDoctortProfile
// );
// router.get(
//   "/patientmanagement/loadprescription/:reservationid",
//   adminAuthMiddleware,
//   patientmanagement.loadPrescription
// );

//manage doctors and staff
router.get(
  "/doctorAndStaffManagement/getSignupRequests",
  doctorAndStaffManagementController.getSignupRequests
);
router.get(
  "/doctorAndStaffManagement/viewdoctor",
  doctorAndStaffManagementController.doctorDetails
);
// router.put(
//   "/doctorAndStaffManagement/acceptSignupRequest",
//   doctorAndStaffManagementController.acceptSignupRequest
// );

//upload doctor profile picture
router.put(
  "/doctorAndStaffManagement/upload-profile-picture/:id",
  profilePictureUpload,
  doctorAndStaffManagementController.uploadPatientProfilePicture
);

router.put(
  "/doctorAndStaffManagement/acceptdoctor",
  doctorAndStaffManagementController.acceptSignupRequest
);
// // Refund Management (You need a controller function for handling refunds)
// router.get('/admin/refund', adminAuthMiddleware);

module.exports = router;
