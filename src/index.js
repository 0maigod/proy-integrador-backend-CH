const express = require('express');

const compression = require('compression');
const loggerInfo = require('pino')();
const loggerWarn = require('pino')('warn.log');
const loggerError = require('pino')('error.log');
const { FuncionLocalStrategyLogin, FuncionLocalStrategyRegister } = require('./passportLR');

const cookieParser = require('cookie-parser');
require('dotenv').config();
const database = require('./services/mongo.db');
const session = require('express-session');
const ProductosController = require('./controllers/ProductosController');
const BaseController = require('./controllers/BaseController');
const path = require('path');
const handlebars = require('express-handlebars');
const passport = require('passport');
const twilio = require('./services/notificaciones/twilio')

const MongoStore = require('connect-mongo');
const User = require('./models/User');

const app = express()
app.set("port", process.env.PORT || 8080);
const http = require('http').Server(app)
let io = require('socket.io')(http)


// Settings
let messages = [{
    text: "Hola soy el primer mensaje",
    autor: "Oma"
}]


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
        secret: process.env.SECRET,
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
// Autenticacion
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
        
        //------SOCKET IO-------------------------------

        io.on("connection", function(socket) {
            socket.emit('coneccion', 'Bienvenidx, por favor indique su nombre')
            io.emit("recargMsg", messages)   
            
            socket.on('bienvenida', (data) => {
                console.log(data);
            });
            
            socket.on("newMsg", function (newMsg) {
                
                const { autor, texto } = newMsg
                const msg = {
                            autor,
                            texto
                }
                if (texto.includes('administrador')){
                    console.log('Dice Administrador!!')
                    twilio.enviarWAm(autor, texto)
                }
                messages.push(msg)
                        return io.emit("recargMsg", messages)
                })
        });

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

    //------SOCKET IO-------------------------------

    io.on("connection", function(socket) {
        socket.emit('coneccion', 'Bienvenidx, por favor indique su nombre')
        io.emit("recargMsg", messages)   
        
        socket.on('bienvenida', (data) => {
            console.log(data);
        });
        
        socket.on("newMsg", function (newMsg) {
            
            const { autor, texto } = newMsg
            const msg = {
                        autor,
                        texto
            }
            if (texto.includes('administrador')){
                console.log('Dice Administrador!!')
                twilio.enviarWAm(autor, texto)
            }
            messages.push(msg)
                    return io.emit("recargMsg", messages)
            })
    });

    loggerWarn.warn(`Worker ${process.pid} started`);
}
