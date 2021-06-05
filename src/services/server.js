const express = require('express');
require('../middleware/auth');

const path = require('path');
const handlebars = require('express-handlebars');

const mainRouter = require('../routes/base');
const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use('/api', mainRouter);

app.engine(
    'hbs',
    handlebars({
        extname: '.hbs',
        defaultLayout: 'main.hbs',
        layoutsDir: path.join(__dirname, '..', '..', 'views', 'layouts'),
        partialsDir: path.join(__dirname, '..', '..', 'views', 'partials')
    })
);

app.set('views', path.join(__dirname, '..', '..', 'views'));
app.set('view engine', 'hbs');

module.exports = app;