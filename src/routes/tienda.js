const express = require('express')
const router = express.Router();


const ControladorTienda = require('../controllers/TiendaController')


const auth = function (req, res, next) {
    
    if (!req.session.user) {
        res.status(200).render('login');
        return;
    }

        username = req.session.user;
        return next();
};
class RouterTienda {

    constructor() {
        this.tiendaController = new ControladorTienda()
    }

    start() {
        router.get('/',auth, this.tiendaController.obtenerProductos)

        return router
    }
}

module.exports = RouterTienda