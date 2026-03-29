const express = require('express');
const router = express.Router();
const reportController = require('../controllers/Admins/reportController');


router.post('/report-1',reportController.generateMonthlyReport);
//router.post('/report-2',reportController.getDoctorPayment);

module.exports = router;