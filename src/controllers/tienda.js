const passport = require('passport');
const jwt = require('jsonwebtoken');

const loggerInfo = require('pino')();
const loggerWarn = require('pino')('warn.log');
const loggerError = require('pino')('error.log');

const DBProducto = require('../models/Producto');


isAdmin = true

const tienda = async (req, res, next) => {
    // req.session.touch();
    // req.session.save((err) => {
    //     if (err) {
    //         loggerError.error('Error al ingresar: ' + err);
    //     }
    // });
    let reqProds = await DBProducto.find();
    let productos = JSON.stringify(reqProds);
    if (reqProds.length == 0) {
        res.status(200).render('ingresar', { productos: reqProds, listExists: false, titulo: 'titulo' });
    } else {
        res.status(200).render('ingresar', { productos: JSON.parse(productos), listExists: true, userExists: isAdmin, user: 'username', titulo: 'titulo' });
    }
}

const ingresar = async (req, res, next) => {
    const { nombre, precio, foto, descripcion, codigo, stock } = req.body;

    if (isAdmin) {
        let timestamp = Date.now();
        const prod = new DBProducto({
            timestamp,
            nombre,
            precio: parseInt(precio),
            foto,
            descripcion,
            codigo,
            stock: parseInt(stock)
        });
        await prod.save();
        let reqProds = await DBProducto.find();
        let productos = JSON.stringify(reqProds);
        loggerInfo.info('Producto agregado a DB');
        return res.status(200).render('ingresar', { productos: JSON.parse(productos), listExists: true, userExists: true, titulo: 'titulo' });
    } else {
        res.send(`{ error : -1, descripcion: ruta '/productos' método 'agregar' no autorizado }`);
    }
}

module.exports = { tienda, ingresar };