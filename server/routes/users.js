const express = require('express');
const router = express.Router();
const userController =  require('../controllers/userController');
const authMiddleware = require('../middleware/auth/authenticateJWT');
const {authorizeRole} = require('../middleware/auth/authorizeRole');
const {rateLimiterMiddleware} = require('../middleware/rateLimit/rateLimiter')

// router.get('/', authMiddleware , (req, res) => {
//     res.send('User List');
// });

router.get('/', rateLimiterMiddleware,);
router.get('/home', rateLimiterMiddleware );
router.get('/finddoctor', rateLimiterMiddleware);
router.get('/finddoctor/:specialization', rateLimiterMiddleware);
router.get('/finddoctor/:specialization/reservation',[authMiddleware , authorizeRole('user')]);
router.get('/finddoctor/:specialization/:doctor',);
router.get('/package',);
router.get('/pharamacy',[authMiddleware , authorizeRole('user')]);
router.get('/labratory',[authMiddleware , authorizeRole('user')]);
router.get('/aboutus',);
router.get('/404_error',);
router.get('/403_error',);
router.get('/429_error',(req,res) => {
    res.send('Too Much request!');
});
router.get('/userprofile',[authMiddleware , authorizeRole('user')]);
router.get('/user_prescription',[authMiddleware , authorizeRole('user')]);
router.get('/user_payments',[authMiddleware , authorizeRole('user')]);
router.get('/cart',[authMiddleware , authorizeRole('user')]);
router.get('/checkout',[authMiddleware , authorizeRole('user')]);
router.get('/refund',[authMiddleware , authorizeRole('user')]);
router.get('/refund/request',[authMiddleware , authorizeRole('user')]);
router.post('/verifyuser', userController.verifyUser );
router.post('/register',userController.register);
router.post('/login',userController.login);


module.exports = router;
