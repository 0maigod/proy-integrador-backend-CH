const passport = require('passport');
const loggerInfo = require('pino')();
const loggerWarn = require('pino')('warn.log');
const loggerError = require('pino')('error.log');
const bcrypt = require('bcrypt');
const User = require('./model/models/User');
const LocalStrategy = require('passport-local').Strategy;

const validatePassword = (user, password) => {
    // console.log('Buscando al Username = ' + user)
    return bcrypt.compareSync(password, user.password);
};

const createHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10, null));
};

const FuncionLocalStrategyLogin = new LocalStrategy(
    {
        passReqToCallback: true
    },
    (req, username, password, done) => {
        User.findOne({ username: username }, (err, user) => {
            if (err) {
                return done(err);
            }
            if (!user) {
                loggerWarn.warn('Usuario no encontrado como ' + username);
                return done(null, false);
            }
            if (!validatePassword(user, password)) {
                loggerWarn.warn('Password Invalido');
                return done(null, false);
            }
            loggerWarn.warn('usuario encontrado');
            req.session.user = username;
            req.session.avatar = user.avatar
            return done(null, user);
        });
    }
);

const FuncionLocalStrategyRegister = new LocalStrategy(
    {
        passReqToCallback: true
    },
    function (req, username, password, done) {
        const findOrCreateUser = function () {

            User.findOne({ username: username }, function (err, user) {
                if (err) {
                    loggerWarn.warn('Error en el registro: ' + err);
                    return done(err);
                }
                if (user) {
                    loggerWarn.warn('El usuario ya esta registrado');
                    return done(null, false);
                } else {
                    var newUser = new User();
                    newUser.timestamp = Date.now();
                    newUser.username = username;
                    newUser.usuario = req.body.usuario;
                    newUser.adress = req.body.adress;
                    newUser.age = req.body.age;
                    newUser.phone = req.body.phone;
                    newUser.avatar = req.body.avatar;
                    newUser.password = createHash(password);
                    newUser.save((err) => {
                        if (err) {
                            loggerError.error('Error guardando al usuario: ' + err);
                            throw err;
                        }
                        loggerInfo.info('Usuario creado');
                        return done(null, newUser);
                    });
                }
            });
        };
        process.nextTick(findOrCreateUser);
    }
);



module.exports = { FuncionLocalStrategyLogin, FuncionLocalStrategyRegister };
