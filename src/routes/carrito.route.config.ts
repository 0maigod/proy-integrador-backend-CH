import { Request, Response, Application } from 'express'
import { Producto } from '../producto'
import { CommonRoutesConfig } from './common.route.config'
import bodyParser from 'body-parser'
import { Carrito } from '../carrito'

var jsonParser = bodyParser.json()

let productos: Producto[] = [
    {"id": "1", "timestamp": 1615149531415, "codigo": "PorNeg01", "nombre":"Porotos negros", "precio":79.0, "descripcion":"Contienen una gran cantidad de proteínas. Muy poca grasa saturada y nada de colesterol.", "foto":"img/porotos_negros.jpg", "stock":5},
    {"id": "3", "timestamp": 1615149531415, "codigo": "ArrYam01", "nombre":"Arroz yamani", "precio":25.25, "descripcion":"Es un gran productor de energía. Rico en proteínas, minerales y vitaminas.", "foto":"img/yamani_integral.jpg", "stock":50},
    {"id": "4", "timestamp": 1615149531415, "codigo": "Miel01", "nombre":"Miel", "precio":130.0, "descripcion":"La miel posee una variedad considerable de antioxidantes y regula el azucar en sangre", "foto":"img/miel.jpg", "stock":10},
    {"id": "2", "timestamp": 1615149531415, "codigo": "HarInt01", "nombre":"Harina Integral", "precio":85.0, "descripcion":"Harina de grano entero de trigo. Rica en fibra y en nutrientes. Su color es oscuro.", "foto":"img/harina_integral.jpg", "stock":50},
    {"id": "5", "timestamp": 1615149531415, "codigo": "NueMar01", "nombre":"Nuez Mariposa", "precio":215.50, "descripcion": "La nuez contiene las denominadas grasas buenas. No tapan las arterias, protegen el sistema inmunológico.", "foto":"img/nuez_mariposa.jpg", "stock":90},
    {"id": "6", "timestamp": 1615149531415, "codigo": "CirBom01", "nombre":"Ciruelas Bombon", "precio":839, "descripcion":"Secada al sol sin dejar que se fermente. Conserva las mismas propiedades que la fruta original.", "foto":"img/ciruelas_bombon.jpg", "stock":100}
    ]

export class CarritoRoutes extends CommonRoutesConfig {
    carrito: Carrito

    constructor(app: Application, carrito: Carrito) {
        super(app, 'carritoRoutes')
        this.carrito = carrito

    }
    configureRoutes() {

        this.app.route('/carrito/:id?')
            .get((req: Request, res: Response) =>{
                let idProducto = req.params.id;
                if (!idProducto) {
                    res.status(200).json(this.carrito.productos)
                    return;
                } else {
                    const prod = this.carrito.productos.find(prod => prod.id === idProducto)
                    if(!prod){
                        res.sendStatus(404).send('El producto no se encuentra en el carrito')
                        return
                    } else {
                        res.status(200).json(prod)
                    }
                }
            })
            .post(jsonParser, (req: Request, res: Response) => {
                let idProducto = req.params.id;
                if (!idProducto) {
                    res.send(`Debe suministrar un ID de producto`)
                    return;
                } else {
                    const prod = productos.find(prod => prod.id === idProducto)
                    if(!prod){
                        res.sendStatus(404).send('El producto no se encuentra en nuestra BD')
                        return
                    } else {
                        this.carrito.productos.push(prod)
                        res.status(200).json(prod)
                    }
                }    
            })
            .delete((req: Request, res: Response) =>{
                    const idProducto = req.params.id
                    if (!idProducto) {
                        res.send(`Debe suministrar un ID de producto`)
                        return;
                        } else {
                            const prod = this.carrito.productos.find( prod => prod.id === idProducto)
                            if(!prod){
                                res.sendStatus(404)
                                return
                            }
                            this.carrito.productos = this.carrito.productos.filter( prod => prod.id !== idProducto)
                            res.send(prod)
                        }    
            })

        return this.app
    }
}