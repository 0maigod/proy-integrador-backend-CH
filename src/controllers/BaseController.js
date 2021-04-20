const express = require('express');
const DBProducto = require('../models/Producto');
const querystring = require('querystring');

const router = express.Router();
let isAdmin = false;
let username = '';

const auth = function (req, res, next) {
    console.log('autorizando, hay sesion? = ' + JSON.stringify(req.session));
    if (!req.session.user) {
        res.status(200).render('login');
        return;
    } else if (req.session.user === 'omar') {
        isAdmin = true;
        username = req.session.user;

        return next();
    } else if (req.session.user) {
        username = req.session.user;
        return next();
    }
};

router
    .get('/login', (req, res) => {
        req.session.user = req.query.username;
        req.session.save((err) => {
            if (err) {
                console.log(err);
            }
        });
        res.redirect('/ingresar');
    })
    .get('/logout', (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
            }
        });
        res.send('Se ha deslogueado');
    })
    .get('/ingresar', auth, async (req, res) => {
        req.session.touch();
        console.log('session dentro !!' + JSON.stringify(req.session));
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
