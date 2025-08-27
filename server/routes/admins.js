const express = require("express");
const router = express.Router();
const adminLoginController = require("../controllers/Admins/adminLoginController");
const scheduleController = require("../controllers/Admins/scheduleController");
const DoctorController = require("../controllers/Admins/DoctorController");
const patientmanagement = require("../controllers/Admins/patientmanagementcontroller");
const { adminAuthMiddleware } = require("../middleware/auth/authorizeAdmin");
const staffManagement = require("../controllers/Admins/staffManagementController");
const adminController = require("../controllers/Admins/adminController");
const dashboardController = require("../controllers/Admins/dashboardController");
const { profilePictureUpload } = require("../middleware/upload/profilePictureUpload");

const refundController = require("../controllers/Admins/RefundManagement");
// Admin Authentication Routes
router.post("/login", adminLoginController.login);
router.post("/logout", adminLoginController.logout);
router.get("/home", [adminAuthMiddleware], adminLoginController.home);
// Manage Doctors
router.get(
  "/loaddoctors",
  [adminAuthMiddleware],
  DoctorController.loadApprovedDoctors
);
router.get(
  "/loadpendingdoctors",
  [adminAuthMiddleware],
  DoctorController.loadPendingDoctors
);
router.get(
  "/doctor/:id",
  [adminAuthMiddleware],
  DoctorController.loadDoctorById
);
router.put(
  "/doctor/approve/:id",
  [adminAuthMiddleware],
  DoctorController.approveDoctor
);
router.put(
  "/doctor/suspend/:id",
  [adminAuthMiddleware],
  DoctorController.suspendDoctor
);
// Schedule Management Routes
router.get(
  "/schedules",
  [adminAuthMiddleware],
  scheduleController.getScheduleRequest
);
router.post(
  "/acceptschedule/:id",
  [adminAuthMiddleware],
  scheduleController.makeAcceptScheduleRequest
);
router.post(
  "/rejectschedule/:id",
  [adminAuthMiddleware],
  scheduleController.makeRejectScheduleRequest
);
// Manage Patients (You need a controller function for managing patients)
router.put(
  "/patientmanagement",
  [adminAuthMiddleware],
  patientmanagement.saveProfile
);
router.get(
  "/patientmanagement/viewpatient",
  [adminAuthMiddleware],
  patientmanagement.patientDetails
);
router.get(
  "/patientmanagement/viewdoctor/:id",
  [adminAuthMiddleware],
  patientmanagement.loadDoctortProfile
);
router.get(
  "/patientmanagement/loadprescription/:reservationid",
  [adminAuthMiddleware],
  patientmanagement.loadPrescription
);

router.post(
  "/patientmanagement/uploadprofilepicture/:id",
  adminAuthMiddleware, // (if you want to protect the route)
  profilePictureUpload,
  patientmanagement.uploadProfilePicture // <-- controller function you will write
);

// Manage Staff
router.get(
  "/staff/requests",
  [adminAuthMiddleware],
  staffManagement.getSignupRequests
);
router.get(
  "/staff/counts",
  [adminAuthMiddleware],
  staffManagement.getStaffCounts
);
router.get("/staff", [adminAuthMiddleware], staffManagement.getAllStaff);
router.put(
  "/staff/:userId/status",
  [adminAuthMiddleware],
  staffManagement.updateStaffStatus
);

router.post("/admins", [adminAuthMiddleware], adminController.createAdmin);
router.get("/admins", [adminAuthMiddleware], adminController.getAdmins);
router.put(
  "/admins/:id/block",
  [adminAuthMiddleware],
  adminController.toggleAdminBlock
);

// Admin Dashboard Metrics
router.get(
  "/dashboard",
  [adminAuthMiddleware],
  dashboardController.getDashboardMetrics
);
router.get(
  "/dashboard/schdules",
  [adminAuthMiddleware],
  dashboardController.getTopSchedules
);

// Refund Management Routes
router.get(
  "/refunds",
  [adminAuthMiddleware],
  refundController.getRefundRequests
);

router.put(
  "/refunds/:id/approve",
  [adminAuthMiddleware],
  refundController.approveRefund
);

router.put(
  "/refunds/:id/reject",
  [adminAuthMiddleware],
  refundController.rejectRefund
);
module.exports = router;
