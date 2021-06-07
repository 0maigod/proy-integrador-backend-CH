const DBProducto = require('../models/Producto');

const loggerInfo = require('pino')();
const loggerWarn = require('pino')('warn.log');
const loggerError = require('pino')('error.log');


const controller = {};
// const isAdmin = true;
let username = '';
const titulo = process.env.TITULO || 'Coderhouse desafio Final';

controller.get = async (req, res) => {
    req.session.touch();
    req.session.save((err) => {
        if (err) {
            loggerError.error('Error al ingresar: ' + err);
        }
    });
    let reqProds = await DBProducto.find();
    let productos = JSON.stringify(reqProds);
    if (reqProds.length == 0) {
        res.status(200).render('ingresar', { productos: reqProds, listExists: false, titulo: titulo });
    } else {
        res.status(200).render('ingresar', { productos: JSON.parse(productos), listExists: true, userExists: isAdmin, user: username, titulo: titulo });
    }
}

controller.by_id = async (req, res) => {
    const { id } = req.params;
    let reqProds;
    if (!id) {
        reqProds = await DBProducto.find();
        return res.status(200).json(reqProds);
    }
    try {
        reqProds = await DBProducto.find({ _id: id });
        return res.status(200).json(reqProds);
    } catch (err) {
        err.stack;
        return res.send(`{error: 'producto no encontrado'}`);
    }
}

controller.min_max = async (req, res) => {
    let min = req.params.min;
    let max = req.params.max;
    if (!min || max) {
        console.log('falta un precio');
        return;
    }
    console.log('precio minimo ' + min);
    console.log('precio maximo ' + max);
}

controller.post = async (req, res) => {
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
        return res.status(200).render('ingresar', { productos: JSON.parse(productos), listExists: true, userExists: true, titulo: titulo });
    } else {
        res.send(`{ error : -1, descripcion: ruta '/productos' método 'agregar' no autorizado }`);
    }
}

controller.put = async (req, res) => {
    if (isAdmin) {
        const { id } = req.params;
        let prod = await DBProducto.find({ _id: id });
        if (prod.length == 0) {
            res.send(`{error: 'producto no encontrado'}`);
            return;
        }
        let timestamp = Date.now();
        const { nombre, precio, foto, descripcion, codigo, stock } = req.body;
        let prodNuevo = {
            id: id,
            timestamp,
            nombre,
            precio: parseInt(precio),
            foto,
            descripcion,
            codigo,
            stock: parseInt(stock)
        };
        await DBProducto.updateOne({ _id: id }, prodNuevo);
        console.log('Producto modificado en DB');
        res.status(200).json(prod);

        return;
    }
    res.send(`{ error : -1, descripcion: ruta '/productos' método 'modificar' no autorizado }`);
}

controller.delete = async (req, res) => {
    if (isAdmin) {
        const { id } = req.params;
        if (!id) {
            res.send(`{ error : -1, descripcion: debe ingresar el ID del producto }`);
            return;
        }
        let prod = await DBProducto.find({ _id: id });
        if (prod.length == 0) {
            res.send(`{error: 'producto no encontrado'}`);
            return;
        }
        await DBProducto.deleteOne({ _id: id });
        res.send(prod);
        return;
    }
    res.send(`{ error : -1, descripcion: ruta '/productos' método 'borrar' no autorizado }`);
}


module.exports = controller;
