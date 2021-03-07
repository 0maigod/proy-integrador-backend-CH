import { Request, Response, Application } from 'express'
import { Producto } from '../producto'
import { CommonRoutesConfig } from './common.route.config'
import  bodyParser from 'body-parser'

var jsonParser = bodyParser.json()

export class ProductoRoutes extends CommonRoutesConfig {
    productos: Producto[]
    isAdmin: boolean
    constructor(app: Application, productos: Producto [], isAdmin: boolean) {
        super(app, 'productoRoutes')
        this.productos = productos
        this.isAdmin = isAdmin
    }
    configureRoutes() {

        this.app.route('/producto/:id?')
            .get((req: Request, res: Response) => {
                let idProducto = req.params.id;
                if(this.productos.length === 0){
                        res.status(404).send(`{error: 'no hay productos cargados'}`)
                        return
                }
                if (!idProducto) {
                    res.status(200).json(this.productos)
                    return;
                } else {
                    const id = req.params.id
                    const prod = this.productos.find( prod => prod.id === id)
                    if (!prod){
                        res.send(`{error: 'producto no encontrado'}`)
                        return
                    }
                    res.status(200).json(prod)
                }
            })
            .post(jsonParser, (req: Request, res: Response) => {
                if (this.isAdmin) {
                        let id = (this.productos.length + 1).toString()
                        let timestamp = Date.now()
                        const {nombre, precio, foto, descripcion, codigo, stock} = req.body
                        const prod = {
                            id,
                            timestamp,
                            nombre,
                            precio: parseInt(precio),
                            foto,
                            descripcion,
                            codigo,
                            stock: parseInt(stock)
                        }
                        this.productos.push(prod)
                        res.status(200).json(prod)
                } 
                res.send(`{ error : -1, descripcion: ruta '/productos' método 'agregar' no autorizado }`)
            
            })
            .put(jsonParser, (req: Request, res: Response) =>{
                if (this.isAdmin) {
                        const idProducto = req.params.id
                        let prod = this.productos.find( prod => prod.id === idProducto)
                        if (!prod){
                            res.send(`{error: 'producto no encontrado'}`)
                            return
                        }
                        this.productos = this.productos.filter( prod => prod.id !== idProducto)
                        let timestamp = Date.now()
                        const {nombre, precio, foto, descripcion, codigo, stock} = req.body
                        prod = {
                            id: idProducto,
                            timestamp,
                            nombre,
                            precio: parseInt(precio),
                            foto,
                            descripcion,
                            codigo,
                            stock: parseInt(stock)
                        }
                        this.productos.push(prod)
                        res.status(200).json(prod)
                }
                res.send(`{ error : -1, descripcion: ruta '/productos' método 'modificar' no autorizado }`)
            })
            .delete((req: Request, res: Response) =>{
                if (this.isAdmin) {
                        const id = req.params.id
                        const prod = this.productos.find( prod => prod.id === id)
                        if(!prod){
                            res.sendStatus(404)
                            return
                        }
                        this.productos = this.productos.filter( prod => prod.id !== id)
                        res.send(prod)
                } 
                res.send(`{ error : -1, descripcion: ruta '/productos' método 'borrar' no autorizado }`)
            })

        return this.app
    }
}