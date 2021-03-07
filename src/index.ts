import Server from './server/server'
import endpoint from './endpoints.config'
import { CommonRoutesConfig } from './routes/common.route.config'
import {ProductoRoutes} from './routes/producto.route.config'
import {CarritoRoutes} from './routes/carrito.route.config'
import { Producto } from './producto'
import { Carrito } from './carrito'


const server = Server.init(endpoint.port)
const routes: Array<CommonRoutesConfig> = []
let productos: Producto[] = []
const isAdmin: boolean = true

routes.push(new ProductoRoutes(server.app, productos, isAdmin))
routes.push(new CarritoRoutes(server.app, new Carrito("newCarritou", [])))
server.app.use((req, res) => {
      res.json({
        error: {
          'name':'Error',
          'status':404,
          'message':'Invalid Request',
          'statusCode':404,
          'stack':'http://localhost:8080/'
        },
         message: 'Ruta no encontrada'
      });
});


server.start(() => console.log(`Servidor corriendo en ${endpoint.port}` ))