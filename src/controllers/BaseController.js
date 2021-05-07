const express = require('express');
const DBProducto = require('../models/Producto');
const passport = require('passport');
const path = require('path');
const router = express.Router();
const { fork } = require('child_process');

let isAdmin = false;
let username = '';
const titulo = process.env.TITULO;

const auth = function (req, res, next) {
    if (!req.session.user) {
        res.status(200).render('login');
        return;
    } else if (req.session.user === 'HO Ester') {
        isAdmin = true;
        username = 'Oma';
        return next();
    } else if (req.session.user) {
        isAdmin = false;
        username = req.session.user;
        return next();
    }
};

router
    .get('/login', (req, res) => {
        if (req.isAuthenticated()) {
            res.redirect('/ingresar');
        } else {
            res.render('login', { titulo: titulo });
        }
    })
    .get('/auth/facebook', passport.authenticate('facebook'))
    .get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), function (req, res) {
        console.log('Ingreso exitooooso');
        res.redirect('/ingresar', { titulo: titulo });
    })
    .post('/login', passport.authenticate('login', { failureRedirect: '/faillogin' }), (req, res) => {
        req.session.save((err) => {
            if (err) {
                console.log('HOUSTIONNNNNNN ' + err);
            }
        });
        res.redirect('/ingresar');
    })
    .get('/register', passport.authenticate('register', { failureRedirect: '/failregister' }), (req, res) => {
        res.redirect('/ingresar');
    })
    .get('/failregister', (req, res) => {
        res.render('error', { error: 'No se pudo registrar el usuario' });
    })
    .get('/faillogin', (req, res) => {
        res.render('error', { error: 'No se pudo loguear' });
    })
    .get('/error', (req, res) => {
        res.status(200).render('error');
    })
    .get('/info', (req, res) => {
        res.status(200).render('info', {
            args: JSON.stringify(process.argv).replace(/,/g, '\n'),
            plataforma: process.platform,
            version: process.version,
            memory: JSON.stringify(process.memoryUsage()).replace(/,/g, '\n'),
            path: process.execPath,
            proceso: process.pid,
            carpeta: process.cwd(),
            titulo: titulo
        });
    })
    .get('/randoms/:cant?', (req, res) => {
        let { cant } = req.params;

        if (cant == undefined) {
            cant = '10000000';
            repetidos = fork(path.join(__dirname, 'randomNums.js'));
            repetidos.send(cant);
            repetidos.on('message', (repNum) => {
                res.status(200).render('ram_nums', { numeros: repNum, titulo: titulo });
            });
        } else {
            repetidos = fork(path.join(__dirname, 'randomNums.js'));
            repetidos.send(cant);
            repetidos.on('message', (repNum) => {
                res.status(200).render('ram_nums', { numeros: repNum, titulo: titulo });
            });
        }
    })
    .get('/logout', (req, res) => {
        const username = req.session.user;
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
            }
        });
        req.logout();
        res.status(200).render('logout', { user: username });
    })
    .get('/ingresar', async (req, res) => {
        console.log(req.session.username);
        req.session.touch();
        req.session.save((err) => {
            if (err) {
                console.log(err);
            }
        });
        let reqProds = await DBProducto.find();
        let productos = JSON.stringify(reqProds);
        if (reqProds.length == 0) {
            res.status(200).render('ingresar', { productos: reqProds, listExists: false, titulo: titulo });
        } else {
            res.status(200).render('ingresar', { productos: JSON.parse(productos), listExists: true, userExists: isAdmin, user: username, titulo: titulo });
        }
    })
    .post('/ingresar', async (req, res) => {
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
            return res.status(200).render('ingresar', { productos: JSON.parse(productos), listExists: true, userExists: true, titulo: titulo });
        } else {
            res.send(`{ error : -1, descripcion: ruta '/productos' método 'agregar' no autorizado }`);
        }
    });

module.exports = router;
