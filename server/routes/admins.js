const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth/authenticateJWT');
const {authorizeRole} = require('../middleware/auth/authorizeRole');
const {rateLimiterMiddleware} = require('../middleware/rateLimit/rateLimiter')
const adminAuthController = require('../controllers/Admins/adminAuthController')

router.get('/',);
router.get('/admin',);
router.get('/admin/dashboard',);
router.get('/admin/managedoctors',);
router.get('/admin/managepatient',);
router.get('/admin/refund',);
router.post('/login',adminAuthController.login);

module.exports = router;
