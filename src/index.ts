import Server from './server/server'
import router from './routes/router'
import endpoint from './endpoints.config'

const server = Server.init(endpoint.port)

server.app.use(router)

server.start(() => console.log(`Servidor corriendo en ${endpoint.port}` ))