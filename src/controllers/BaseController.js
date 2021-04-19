const express = require('express');
const DBProducto = require('../models/Producto');
const querystring = require('querystring');

const router = express.Router();
let isAdmin = false;
let username = '';

const auth = function (req, res, next) {
    console.log('autorizando');
    if (!req.query.username) {
        res.status(200).render('login');
        return;
    } else if (req.query.username === 'amy') {
        console.log('le pego');
        req.session.user = 'amy';
        isAdmin = true;
        username = req.session.user;
        console.log('session ' + JSON.stringify(req.session));
        return next();
    } else if (req.query.username) {
        username = req.query.username;
        return next();
    }
};

router
    .get('/logout', (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
            }
        });
        res.send('Se ha deslogueado');
    })
    .get('/ingresar', auth, async (req, res) => {
        let reqProds = await DBProducto.find();
        let productos = JSON.stringify(reqProds);
        if (reqProds.length == 0) {
            res.status(200).render('ingresar', { productos: reqProds, listExists: false });
        } else {
            res.status(200).render('ingresar', { productos: JSON.parse(productos), listExists: true, userExists: isAdmin, user: username });
        }
    })
    .post('/ingresar', (req, res) => {
        let respuesta = '';
        let formulario;
        if (isAdmin) {
            req.on('data', function (data) {
                respuesta += data;
            }).on('end', async () => {
                formulario = querystring.parse(respuesta);
                let timestamp = Date.now();
                const { nombre, precio, foto, descripcion, codigo, stock } = formulario;
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
                console.log('Producto agregado a DB');
                return res.status(200).render('ingresar', { productos: JSON.parse(productos), listExists: true, userExists: true });
            });
        } else {
            res.send(`{ error : -1, descripcion: ruta '/productos' método 'agregar' no autorizado }`);
        }
    });

module.exports = router;
