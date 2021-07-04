const express = require('express')
const router = express.Router();
// const passport = require('passport');

const ControladorProductos = require('../controllers/ProductsController')


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
class RouterProductos {

    constructor() {
        this.productController = new ControladorProductos()
    }

    start() {
        router.get('/:id?',auth, this.productController.obtenerProductos)
        // router.get('/precio/:min&&:max', this.productController.obtenerPorPrecio)
        router.post('/', this.productController.guardarProducto)
        router.patch('/:id?', this.productController.actualizarProducto)
        router.delete('/:id?', this.productController.borrarProducto)

        return router
    }
}

module.exports = RouterProductos