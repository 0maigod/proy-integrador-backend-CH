const express = require('express');
const DBProducto = require('../models/Producto');
const passport = require('passport');
const upload = require('../libs/storage');

const loggerInfo = require('pino')();
const loggerWarn = require('pino')('warn.log');
const loggerError = require('pino')('error.log');

const path = require('path');
const router = express.Router();
const { fork } = require('child_process');
const calculo = require('./randomNums');
const numCPUs = require('os').cpus().length;

const ethereal = require('../notificaciones/nmailer-ethereal')
const gmail = require('../notificaciones/nmailer-gmail')
const twilio = require('../notificaciones/twilio')

let isAdmin = false;
let username = '';
const titulo = process.env.TITULO || 'Coderhouse desafio Final';

const auth = function (req, res, next) {
    
    if (!req.session.user) {
        res.status(200).render('login');
        return;
    } else if (req.session.user === 'deme@gmail.com') {
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
        const username = req.session.user;
        // const foto = 'req.session.avatar';
        let asunto = 'Log In'
        let mensaje = 'Ingresó ' + username + ' en la fecha ' + new Date().toLocaleString()
        ethereal.enviarMail(asunto, mensaje, (err, info) => {
            if(err) loggerInfo.info(`Error de logIn al Ethereal ${err}`)
            else loggerInfo.info(`Login al Ethereal ${info}`)
            gmail.enviarGmail(asunto, mensaje, (err, info) => {
                if(err) loggerInfo.info(`Error de logIn al Gmail ${err}`)
                else loggerInfo.info(`LogIn al Gmail ${info}`)    
            })
        })
        twilio.enviarWAm(username, mensaje)

        res.redirect('/ingresar');
    })
    .post('/register', upload.single('avatar'), passport.authenticate('register', { failureRedirect: '/failregister' }), (req, res) => {
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
        let asunto = 'logging Out'
        let mensaje = 'Egresó ' + username + ' en la fecha ' + new Date().toLocaleString()
        ethereal.enviarMail(asunto, mensaje, (err, info) => {
            if(err) loggerInfo.info(`Error de logout ${err}`)
            else loggerInfo.info(`Mail de logout ${info}`)
            res.status(200).render('logout', { user: username });
        })
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
            repetidos = fork(path.join(__dirname, 'randomNums.js'));
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
