const express = require('express');
const cookieParser = require('cookie-parser');
const database = require('./databases/mongo.db');
const session = require('express-session');
const ProductosController = require('./controllers/ProductosController');
const BaseController = require('./controllers/BaseController');
const path = require('path');
const handlebars = require('express-handlebars');
const bcrypt = require('bcrypt');
const passport = require('passport');

const FacebookStrategy = require('passport-facebook').Strategy;
const MongoStore = require('connect-mongo');
const User = require('./models/User');

// Settings
// database();
const app = express();
const PORT = parseInt(process.argv[2]) || process.env.PORT;
const FB_id = process.argv[3] || process.env.FACEBOOK_CLIENT_ID;
const FB_secret = process.argv[4] || process.env.FACEBOOK_CLIENT_SECRET;

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
            maxAge: 6000
        }
    })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new FacebookStrategy(
        {
            clientID: FB_id,
            clientSecret: FB_secret,
            callbackURL: 'http://localhost:3000/auth/facebook/callback'
        },
        function (accessToken, refreshToken, profile, cb) {
            const findOrCreateUser = function () {
                User.findOne({ facebookId: profile.id }, function (err, user) {
                    if (err) {
                        console.log('Error in SignUp: ' + err);
                        return cb(err);
                    }
                    if (user) {
                        console.log('User already exists');
                        req.session.user = user.username;
                        return cb(null, false);
                    } else {
                        var newUser = new User();
                        newUser.username = profile.displayName;
                        req.session.user = user.username;
                        newUser.facebookId = profile.id;
                        newUser.save((err) => {
                            if (err) {
                                console.log('Error in Saving user: ' + err);
                                throw err;
                            }
                            console.log('User Registration succesful');
                            return cb(null, newUser);
                        });
                    }
                });
            };
            process.nextTick(findOrCreateUser);
        }
    )
);

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
app.use('/', BaseController);
app.use('/productos', ProductosController);

// Server Listening
const srv = app.listen(PORT, () => {
    console.log(`Servidor corriendo en ${PORT}`);
    try {
        database();
        console.log('Connecting to DB');
    } catch (error) {
        console.log(`Error en la coneccion a la DB: ${error}`);
    }
});

srv.on('error', (error) => console.log(`Error en el servidor: ${error}`));
