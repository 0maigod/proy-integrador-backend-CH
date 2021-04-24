const express = require('express');
const DBProducto = require('../models/Producto');

const router = express.Router();
let isAdmin = false;
let username = '';

const auth = function (req, res, next) {
    // console.log('autorizando, hay sesion? = ' + JSON.stringify(req.session));
    if (!req.session.user) {
        res.status(200).render('login');
        return;
    } else if (req.session.user === 'omar') {
        isAdmin = true;
        username = req.session.user;
        return next();
    } else if (req.session.user) {
        isAdmin = false;
        username = req.session.user;
        return next();
    }
};

router
    .get('/login', (req, res) => {
        req.session.user = req.query.username;
        req.session.pass = req.query.password;
        req.session.save((err) => {
            if (err) {
                console.log(err);
            }
        });
        res.redirect('/ingresar');
    })
    .get('/error', (req, res) => {
        res.status(200).render('error');
    })
    .get('/logout', (req, res) => {
        const username = req.session.user;
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
            }
        });
        res.status(200).render('logout', { user: username });
    })
    .get('/ingresar', auth, async (req, res) => {
        req.session.touch();
        req.session.save((err) => {
            if (err) {
                console.log(err);
            }
        });
        // console.log('session dentro !!' + JSON.stringify(req.session));
        let reqProds = await DBProducto.find();
        let productos = JSON.stringify(reqProds);
        if (reqProds.length == 0) {
            res.status(200).render('ingresar', { productos: reqProds, listExists: false });
        } else {
            res.status(200).render('ingresar', { productos: JSON.parse(productos), listExists: true, userExists: isAdmin, user: username });
        }
    })
    .post('/ingresar', async (req, res) => {
        console.log('golpeando al post de ingresar');
        console.log(req.body);
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
            console.log('Producto agregado a DB');
            return res.status(200).render('ingresar', { productos: JSON.parse(productos), listExists: true, userExists: true });
        } else {
            res.send(`{ error : -1, descripcion: ruta '/productos' método 'agregar' no autorizado }`);
        }
    });

module.exports = router;
