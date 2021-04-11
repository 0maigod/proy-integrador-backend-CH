import { createServer } from 'http';
import express from 'express';
import { Server, Socket } from 'socket.io';
import moment from 'moment';
import path from 'path';
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

const routes: Array<CommonRoutesConfig> = [];
let productos: Producto[] = [];
const isAdmin: boolean = true;

let app = express();
let http = createServer(app);
const io = new Server(http);

routes.push(new ProductoRoutes(app, productos, isAdmin));
routes.push(new CarritoRoutes(app, new Carrito('newCarritou', [])));

//---------ESTATICOS---------------------

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});
app.use(express.static(path.join(__dirname, '..', 'public')), (req, res) => {
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

//------SOCKET IO-------------------------------

io.on('connection', function (socket: Socket) {
    console.log('conectando socket');
    socket.emit('conexion', 'Bienvenidx, por favor indique su email');
    DBMensajes.find().then((messagesSolved) => {
        console.log(messagesSolved);
        io.emit('recargMsg', messagesSolved);
    });

    socket.on('bienvenida', (data: any) => {
        console.log(data);
    });

    socket.on('newMsg', function (message: Mensaje) {
        const { id, nombre, apellido, edad, text, alias, avatar } = message;
        const author = [id, nombre, apellido, edad, alias, avatar];
        const fecha = moment().format('DD MMM, h:mm:ss a');
        const msg = new DBMensajes({
            author,
            fecha,
            text
        });
        msg.save().then(() => {
            DBMensajes.find().then((mensajes) => {
                return io.emit('recargMsg', mensajes);
            });
        });
    });
});

//--------SERVIDOR------------------------------------------------

http.listen(endpoint.port, () => {
    console.log(`Servidor corriendo en ${endpoint.port}`);
}).on('error', console.log);
