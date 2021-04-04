import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import moment from 'moment';
import ServerXp from './server/server';
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
const server = ServerXp.init(endpoint.port);
const routes: Array<CommonRoutesConfig> = [];
let productos: Producto[] = [];
const isAdmin: boolean = true;

let http = createServer(server.app);
const io = new Server(http);

routes.push(new ProductoRoutes(server.app, productos, isAdmin));
routes.push(new CarritoRoutes(server.app, new Carrito('newCarritou', [])));

//------SOCKET IO-------------------------------

io.on('connection', function (socket: Socket) {
    console.log('conectando socket');
    socket.emit('conexion', 'Bienvenidx, por favor indique su email');
    DBMensajes.find().then((messagesSolved) => io.emit('recargMsg', messagesSolved));

    socket.on('bienvenida', (data: any) => {
        console.log(data);
    });

    socket.on('newMsg', function (message: Mensaje) {
        const { email, mensaje } = message;
        const fecha = moment().format('DD MMM, h:mm:ss a');
        const msg = new DBMensajes({
            email,
            fecha,
            mensaje
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
