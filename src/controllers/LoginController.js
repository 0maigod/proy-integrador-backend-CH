const loggerInfo = require('pino')();
const loggerWarn = require('pino')('warn.log');
const loggerError = require('pino')('error.log');

const ethereal = require('../utils/notificaciones/nmailer-ethereal')
const gmail = require('../utils/notificaciones/nmailer-gmail')

const controller = {};


controller.reg_save = (req, res) => {
            res.redirect('/login');
};

controller.si_view = (req, res) => {
            if (req.isAuthenticated()) {
                res.redirect('/tienda');
            } else {
                res.render('login');
            }
};

controller.si_save = (req, res) => {
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
    
    res.redirect('/tienda');
};

controller.fail_reg = (req, res) => {
    loggerWarn.warn('No se pudo registrar el usuario');
    res.render('error', { error: 'No se pudo registrar el usuario' });
};

controller.fail_log = (req, res) => {
    loggerWarn.warn('Error no se pudo loguear: ');
    res.render('error', { error: 'No se pudo loguear' });
};

controller.error = (req, res) => {
    console.log('tirrando error')
    res.status(200).render('error');
};

controller.logout = (req, res) => {
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
};


// .get('*', (req, res) => {
//     let { url, method } = req;
//     loggerWarn.warn('Ruta %s %s no implementada', url, method);
//     res.send(`Ruta ${method} ${url} no está implementada`);
// });


module.exports = controller;