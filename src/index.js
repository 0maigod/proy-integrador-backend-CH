const express = require('express');

const compression = require('compression');
const loggerInfo = require('pino')();
const loggerWarn = require('pino')('warn.log');
const loggerError = require('pino')('error.log');
const { FuncionLocalStrategyLogin, FuncionLocalStrategyRegister } = require('./passportLR');

const cookieParser = require('cookie-parser');
require('dotenv').config();
const database = require('./databases/mongo.db');
const session = require('express-session');
const ProductosController = require('./controllers/ProductosController');
const BaseController = require('./controllers/BaseController');
const path = require('path');
const handlebars = require('express-handlebars');
// const bcrypt = require('bcrypt');
const passport = require('passport');

// const LocalStrategy = require('passport-local').Strategy;
const MongoStore = require('connect-mongo');
const User = require('./models/User');

// Settings
const app = express();
const PORT = parseInt(process.argv[2]) || process.env.PORT;
const MODO = process.argv[3] || 'FORK';

app.engine(
    'hbs',
    handlebars({
        extname: '.hbs',
        defaultLayout: 'main.hbs',
        layoutsDir: path.join(__dirname, '..', 'views', 'layouts'),
        partialsDir: path.join(__dirname, '..', 'views', 'partials')
    })
);

app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'hbs');

// Middlewares
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true
    })
);
app.use(cookieParser());

app.use(compression());

app.use(
    session({
        secret: 'keyboard cat',
        resave: false,
        rolling: true,
        saveUninitialized: true,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_DB
        }),
        cookie: {
            maxAge: 60000
        }
    })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use('login', FuncionLocalStrategyLogin);
passport.use('register', FuncionLocalStrategyRegister);

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

// Routes
app.use(express.static('public'));

if (MODO == 'CLUSTER') {
    loggerWarn.warn(`Servidor funcionando en modo: ${MODO}`);

    if (cluster.isMaster) {
        loggerWarn.warn(`PID master: ${process.pid}`);

        for (let i = 0; i < numCPUs; i++) {
            cluster.fork();
        }

        cluster.on('exit', (worker, code, signal) => {
            loggerWarn.warn(`Worker ${worker.process.pid} ha muerto`);
            cluster.fork();
        });
    } else {
        // Routes
        app.use('/', BaseController);
        app.use('/productos', ProductosController);

        // Server Listening
        const srv = app.listen(PORT, () => {
            loggerInfo.info(`Servidor corriendo en ${PORT}`);
            try {
                database();
                loggerInfo.info('Connecting to DB');
            } catch (error) {
                loggerError.error(`Error en la coneccion a la DB: ${error}`);
            }
        });

        srv.on('error', (error) => loggerError.error(`Error en el servidor: ${error}`));

        loggerInfo.info(`Worker ${process.pid} started`);
    }
} else if (MODO == 'FORK') {
    loggerWarn.warn(`Servidor funcionando en modo: ${MODO}`);
    app.use('/', BaseController);
    app.use('/productos', ProductosController);

    // Server Listening
    const srv = app.listen(PORT, () => {
        loggerInfo.info(`Servidor corriendo en ${PORT}`);
        try {
            database();
            loggerInfo.info('Connecting to DB');
        } catch (error) {
            loggerError.error(`Error en la coneccion a la DB: ${error}`);
        }
    });

    srv.on('error', (error) => loggerError.error(`Error en el servidor: ${error}`));

    loggerWarn.warn(`Worker ${process.pid} started`);
}
