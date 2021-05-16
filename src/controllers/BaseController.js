const express = require('express');
const DBProducto = require('../models/Producto');
const passport = require('passport');

const loggerInfo = require('pino')();
const loggerWarn = require('pino')('warn.log');
const loggerError = require('pino')('error.log');

const path = require('path');
const router = express.Router();
const { fork } = require('child_process');
const calculo = require('./randomNums');
const numCPUs = require('os').cpus().length;

let isAdmin = false;
let username = '';
const titulo = process.env.TITULO || 'Coderhouse desafio 31';

const auth = function (req, res, next) {
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
        if (req.isAuthenticated()) {
            res.redirect('/ingresar');
        } else {
            res.render('login');
        }
    })
    .post('/login', passport.authenticate('login', { failureRedirect: '/faillogin' }), (req, res) => {
        req.session.save((err) => {
            if (err) {
                loggerError.error('Error en el login: ' + err);
            }
        });
        res.redirect('/ingresar');
    })
    .get('/register', passport.authenticate('register', { failureRedirect: '/failregister' }), (req, res) => {
        res.redirect('/ingresar');
    })
    .get('/failregister', (req, res) => {
        loggerWarn.warn('No se pudo registrar el usuario');
        res.render('error', { error: 'No se pudo registrar el usuario' });
    })
    .get('/faillogin', (req, res) => {
        loggerWarn.warn('Error no se pudo loguear: ');
        res.render('error', { error: 'No se pudo loguear' });
    })
    .get('/error', (req, res) => {
        res.status(200).render('error');
    })
    .get('/logout', (req, res) => {
        const username = req.session.user;
        req.session.destroy((err) => {
            if (err) {
                loggerError.error('Error en el logout: ' + err);
            }
        });
        req.logout();
        res.status(200).render('logout', { user: username });
    })
    .get('/info', (req, res) => {
        let argumentos = JSON.stringify(process.argv).replace(/,/g, '\n');
        let plataforma = process.platform;
        let version = process.version;
        let memoria = JSON.stringify(process.memoryUsage()).replace(/,/g, '\n');
        let ruta = process.execPath;
        let process = process.pid;
        let folder = process.cwd();

        console.log(
            `Argumentos: ${argumentos}, Plataforma: ${plataforma}, Version: ${version}, Memoria: ${memoria}, Path: ${ruta}, Proceso: ${process}, Carpeta: ${folder}, Numero de procesadores: ${numCPUs}`
        );

        res.status(200).render('info', {
            args: argumentos,
            plataforma: plataforma,
            version: version,
            memory: memoria,
            path: ruta,
            proceso: process,
            carpeta: folder,
            cpus: numCPUs,
            titulo: titulo
        });
    })
    .get('/randoms/:cant?', (req, res) => {
        let { cant } = req.params;

        if (cant == undefined) {
            cant = '10000000';
            //proceso sin fork
            repetidos = calculo(cant);
            loggerWarn.warn('La cantidad de números procesados fue: ' + cant);
            res.status(200).render('ram_nums', { numeros: repetidos, titulo: titulo });
        } else {
            // child-process desactivado
            // repetidos = fork(path.join(__dirname, 'randomNums.js'));
            repetidos.send(cant);
            loggerWarn.warn('La cantidad de números procesados fue: ' + cant);
            repetidos.on('message', (repNum) => {
                res.status(200).render('ram_nums', { numeros: repNum, titulo: titulo });
            });
        }
    })
    .get('/ingresar', auth, async (req, res) => {
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
            loggerInfo.info('Producto agregado a DB');
            return res.status(200).render('ingresar', { productos: JSON.parse(productos), listExists: true, userExists: true, titulo: titulo });
        } else {
            res.send(`{ error : -1, descripcion: ruta '/productos' método 'agregar' no autorizado }`);
        }
    })
    .get('*', (req, res) => {
        let { url, method } = req;
        loggerWarn.warn('Ruta %s %s no implementada', url, method);
        res.send(`Ruta ${method} ${url} no está implementada`);
    });

module.exports = router;
