// import express from 'express';
// import { createServer } from 'http';
// import { Server, Socket } from 'socket.io';
// import ServerXp from './server/server';
// import moment from 'moment';
// import path from 'path';
// import endpoint from './endpoints.config';
// import { CommonRoutesConfig } from './routes/common.route.config';
// import { ProductoRoutes } from './routes/producto.route.config';
// import { CarritoRoutes } from './routes/carrito.route.config';
// import { Producto } from './producto';
// import { Carrito } from './carrito';
// import { Mensaje } from './mensaje';
// import database from './routes/mongo.db';
// import DBMensajes from './models/Mensaje';

// database();
// const server = ServerXp.init(endpoint.port);
// const routes: Array<CommonRoutesConfig> = [];
// let productos: Producto[] = [];
// const isAdmin: boolean = true;

// let http = createServer(server.app);
// const io = new Server(http);

// routes.push(new ProductoRoutes(server.app, productos, isAdmin));
// routes.push(new CarritoRoutes(server.app, new Carrito('newCarritou', [])));

// server.app.get('/', function (req, res) {
//     res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
// });

// server.app.use(express.static(path.join(__dirname, '..', 'public')), (req, res) => {
//     res.json({
//         error: {
//             name: 'Error',
//             status: 404,
//             message: 'Invalid Request',
//             statusCode: 404,
//             stack: 'http://localhost:8080/'
//         },
//         message: 'Ruta no encontrada'
//     });
// });

// //------SOCKET IO-------------------------------

// io.on('connection', function (socket: Socket) {
//     console.log('conectando socket');
//     socket.emit('conexion', 'Bienvenidx, por favor indique su email');
//     DBMensajes.find().then((messagesSolved) => io.emit('recargMsg', messagesSolved));

//     socket.on('bienvenida', (data: any) => {
//         console.log(data);
//     });

//     socket.on('newMsg', function (message: Mensaje) {
//         const { email, mensaje } = message;
//         const fecha = moment().format('DD MMM, h:mm:ss a');
//         const msg = new DBMensajes({
//             email,
//             fecha,
//             mensaje
//         });
//         msg.save().then(() => {
//             DBMensajes.find().then((mensajes) => {
//                 return io.emit('recargMsg', mensajes);
//             });
//         });
//     });
// });

// //----------------------------------------------------------------

// // server.start(() => console.log(`Servidor corriendo en ${endpoint.port}`));
// http.listen(endpoint.port, () => {
//     console.log(`Servidor corriendo en ${endpoint.port}`);
// }).on('error', console.log);

// // -----------------------------------------------------------------------

import express from 'express';
import ProductosController from './controllers/ProductosController';
import database from './databases/mongo.db';
import { Producto } from './producto';
import { Carrito } from './carrito';

// Settings
database();
const app = express();
const PORT = process.env.PORT || 8080;
const isAdmin: boolean = true;
app.use(express.json());

// Middlewares

// Routes
app.use('/productos', ProductosController);
// app.use('/carrito', CarritoController);

// Server Listening
app.listen(PORT, () => {
    console.log(`Servidor corriendo en ${PORT}`);
}).on('error', console.log);
