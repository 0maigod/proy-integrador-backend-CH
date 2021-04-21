const express = require('express');
const database = require('./databases/mongo.db');
const session = require('express-session');
const ProductosController = require('./controllers/ProductosController');
const BaseController = require('./controllers/BaseController');
const path = require('path');
const handlebars = require('express-handlebars');

// Settings
database();
const app = express();

const PORT = process.env.PORT || 8080;

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
// app.use(cookieParser());
app.use(
    session({
        secret: 'keyboard cat',
        resave: false,
        rolling: true,
        saveUninitialized: false,
        cookie: {
            maxAge: 60000
        }
    })
);

// Routes
app.use(express.static('public'));
app.use('/', BaseController);
app.use('/productos', ProductosController);

// app.use('/carrito', CarritoController);

// Server Listening
app.listen(PORT, () => {
    console.log(`Servidor corriendo en ${PORT}`);
}).on('error', console.log);
