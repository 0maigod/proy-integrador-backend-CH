const router = require('express').Router();
const passport = require('passport');
const upload = require('../utils/storage');

const loginController = require('../controllers/LoginController');


router.get('/login', loginController.si_view)
    .post('/login', passport.authenticate('login', { failureRedirect: '/faillogin' }), loginController.si_save)
    .post('/register', upload.single('avatar'), passport.authenticate('register', { failureRedirect: '/failregister' }), loginController.reg_save)
    .get('/logout', loginController.logout)
    .get('/failregister', loginController.fail_reg)
    .get('/faillogin', loginController.fail_log)
    .get('/error', loginController.error)

    

module.exports = router;