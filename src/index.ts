import express from 'express';
import Server from './server/server';
import moment from 'moment';
import * as socketio from 'socket.io';
import * as path from 'path';
import endpoint from './endpoints.config';
import { CommonRoutesConfig } from './routes/common.route.config';
import { ProductoRoutes } from './routes/producto.route.config';
import { CarritoRoutes } from './routes/carrito.route.config';
import { Producto } from './producto';
import { Carrito } from './carrito';
import { Mensaje } from './mensaje';
import database from './routes/mongo.db';
import DBMensajes from './models/Mensaje';

database();
const server = Server.init(endpoint.port);
const routes: Array<CommonRoutesConfig> = [];
let productos: Producto[] = [];
const isAdmin: boolean = true;

const app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);

routes.push(new ProductoRoutes(server.app, productos, isAdmin));
routes.push(new CarritoRoutes(server.app, new Carrito('newCarritou', [])));
server.app.use((req, res) => {
    res.json({
        error: {
            name: 'Error',
            status: 404,
            message: 'Invalid Request',
            statusCode: 404,
            stack: 'http://localhost:8080/'
        },
        message: 'Ruta no encontrada'
    });
});

server.app.use(express.static('public'));

//------SOCKET IO-------------------------------

io.on('connection', function (socket: any) {
    socket.emit('conexion', 'Bienvenidx, por favor indique su nombre');
    DBMensajes.find().then((messagesSolved) => io.emit('recargMsg', messagesSolved));

    socket.on('bienvenida', (data: any) => {
        console.log(data);
    });

    socket.on('newMsg', function (message: Mensaje) {
        const { email, mensaje, id } = message;
        const timestamp = moment().format('DD/MM/YYYY hh:mm:ss');
        const msg = new DBMensajes({
            id,
            email,
            timestamp,
            mensaje
        });
        msg.save()
            .then(function () {
                DBMensajes.find().then((mensajes) => {
                    return mensajes;
                });
            })
            .then(function (response) {
                return io.emit('recargMsg', response);
            });
    });
});

//----------------------------------------------------------------

server.start(() => console.log(`Servidor corriendo en ${endpoint.port}`));
