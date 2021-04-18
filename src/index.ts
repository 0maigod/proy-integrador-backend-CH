import express from 'express';
import session from 'express-session';
import ProductosController from './controllers/ProductosController';
import BaseController from './controllers/BaseController';
import path from 'path';
import handlebars from 'express-handlebars';
import database from './databases/mongo.db';

// Settings
database();
const app = express();
const PORT = process.env.PORT || 8080;
const isAdmin: boolean = true;
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true
    })
);

// Middlewares
app.use(
    session({
        secret: 'keyboard cat',
        resave: false,
        rolling: true,
        saveUninitialized: true,
        cookie: {
            secure: true,
            maxAge: 5000 //5 segundos,
            // expires: new Date(Date.now() + 5000)
        }
    })
);
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

// Routes
app.use(express.static('public'));
app.use('/', BaseController);
app.use('/productos', ProductosController);

// app.use('/carrito', CarritoController);

// Server Listening
app.listen(PORT, () => {
    console.log(`Servidor corriendo en ${PORT}`);
}).on('error', console.log);
