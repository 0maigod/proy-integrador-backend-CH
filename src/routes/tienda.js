const router = require('express').Router();
const passport = require('passport');


const productController = require('../controllers/ProductsController')

const auth = function (req, res, next) {
    
    if (!req.session.user) {
        res.status(200).render('login');
        return;
    } else if (req.session.user === 'saku@gmail.com') {
        //contraseña: 123456
        isAdmin = true;
        username = req.session.user;
        return next();
    } else if (req.session.user) {
        isAdmin = false;
        username = req.session.user;
        return next();
    }
};

router.get('/',auth, productController.get)
    .get('/:id?', productController.by_id)
    .get('/precio/:min&&:max', productController.min_max)
    .post('/', productController.post)
    .put('/:id?', productController.put)
    .delete('/:id?', productController.delete)



module.exports = router;