const router = require('express').Router();
const passport = require('passport');


const carritoController = require('../controllers/CarritoController')

const auth = function (req, res, next) {
    
    if (!req.session.user) {
        res.status(200).render('login');
        return;
    }

        username = req.session.user;
        return next();
};

router.get('/',auth, carritoController.get)
    .put('/', carritoController.put)
    .get('/lista', carritoController.lista)




module.exports = router;