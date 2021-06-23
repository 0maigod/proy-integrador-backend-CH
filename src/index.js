const express = require('express');
const RouterLogin = require('./routes/login');
const RouterTienda = require('./routes/tienda');
const RouterProducto = require('./routes/productos');

const { graphqlHTTP }  = require('express-graphql');
const { schema, root } = require('./middleware/buildGraphql')


const compression = require('compression');
const loggerInfo = require('pino')();
const loggerWarn = require('pino')('warn.log');
const loggerError = require('pino')('error.log');
const { FuncionLocalStrategyLogin, FuncionLocalStrategyRegister } = require('./passportLR');

const cookieParser = require('cookie-parser');
require('dotenv').config();
const Database = require('./dao/DatabaseModel');
const session = require('express-session');

const path = require('path');
const handlebars = require('express-handlebars');
const passport = require('passport');

const MongoStore = require('connect-mongo');
const User = require('./models/User');




const app = express()
const PORT = process.env.PORT || 8080;
app.set("port", PORT);


// const PORT = parseInt(process.argv[2]) || process.env.PORT;


app.engine(
    'hbs',
    handlebars({
        extname: '.hbs',
        defaultLayout: 'main.hbs',
        layoutsDir: path.join(__dirname, 'views', 'layouts'),
        partialsDir: path.join(__dirname, 'views', 'partials')
    })
);

app.set('views', path.join(__dirname, 'views'));
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
            maxAge: 6000000
        }
    })
);

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}));

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

app.use('/', RouterLogin);
app.use('/tienda', RouterTienda);
app.use('/ingresar', RouterProducto);


        
// Server Listening
const srv = app.listen(PORT, () => {
    loggerInfo.info(`Servidor corriendo en ${PORT}`);
        Database;
});

srv.on('error', (error) => loggerError.error(`Error en el servidor: ${error}`));

loggerInfo.info(`Worker ${process.pid} started`);
