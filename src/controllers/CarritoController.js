const DBProducto = require('../models/Producto');

const loggerInfo = require('pino')();
const loggerWarn = require('pino')('warn.log');
const loggerError = require('pino')('error.log');


const controller = {};
const isAdmin = true;

const titulo = process.env.TITULO || 'Coderhouse desafio Final';

controller.get = async (req, res) => {
    req.session.touch();
    req.session.save((err) => {
        if (err) {
            loggerError.error('Error al ingresar: ' + err);
        }
    });
        res.status(200).render('tienda', { listExists: true, user: username, titulo: titulo });
}

controller.lista = async (req, res) => {
    let reqProds = await DBProducto.find();
    let productos = JSON.stringify(reqProds);
        res.status(200).json(productos);
}

controller.put = async (req, res) => {
        const { id } = req.params;
        let prod = await DBProducto.find({ _id: id });
        if (prod.length == 0) {
            res.send(`{error: 'producto sin stock'}`);
            return;
        }
        let timestamp = Date.now();
        const { nombre, precio, foto, descripcion, codigo, stock } = req.body;
        let prodNuevo = {
            id: id,
            timestamp,
            nombre,
            descripcion,
            precio: parseInt(precio),
            codigo,
            stock: parseInt(stock),
            foto
        };
        await DBProducto.updateOne({ _id: id }, prodNuevo);
        console.log('Producto modificado en DB');
        res.status(200).json(prod);

        return;
}


module.exports = controller;