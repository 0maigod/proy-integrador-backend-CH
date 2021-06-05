const express = require('express');
const passport = require('passport');
const router = express.Router();
const upload = require('../services/storage');
const { login, autorizar } = require('../controllers/login');
const { tienda } = require('../controllers/tienda');


router
    .post('/signup', 
        upload.single('avatar'), 
        passport.authenticate(
            'signup', 
            { session: false }), 
        login)
    

router
    .post('/login', autorizar )
    .get('/login', (req, res) => {
            res.render('login');
        }
    );

router
    .get('/tienda', tienda)


module.exports = router;