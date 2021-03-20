import { Request, Response, Application } from 'express'
import { Producto } from '../producto'
import { CommonRoutesConfig } from './common.route.config'
import { knex } from 'knex'
import { options } from './mysql.db'
import { json } from 'express'


const jsonParser = json() 
const knexInstance = knex(options);

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
            .get(async (req: Request, res: Response) => {
                let idProducto = req.params.id;
                    if (!idProducto) {
                    let reqProds:any[] = []
                    await knexInstance.from('producto').select()
                        .then((rows: any[]) => {
                            rows.forEach(row => {
                                reqProds.push(row)
                            })
                        })
                        .then(() => console.log(reqProds))
                        .catch((err: any) => console.log(err))
                        // .finally(() => knexInstance.destroy())
                    
                    res.status(200).json(reqProds)
                    return
                } else {
                    const id = req.params.id
                        let reqProds: any
                    await knexInstance('producto').where('id', id)
                        .then((item: any) => {
                   
                            if (item.length == 0) {
                                res.send(`{error: 'producto no encontrado'}`)
                            } else {
                                reqProds = item
                                res.status(200).json(reqProds)
                            }
                        })
                        .catch((err: any) => console.log(err))
                }
            })
            .post(jsonParser, async (req: Request, res: Response) => {
                if (this.isAdmin) {
                        let timestamp = Date.now()
                        const {nombre, precio, foto, descripcion, codigo, stock} = req.body
                        const prod = {
                            timestamp,
                            nombre,
                            precio: parseInt(precio),
                            foto,
                            descripcion,
                            codigo,
                            stock: parseInt(stock)
                        }
                        await knexInstance('producto').insert(prod)
                            .then(() => console.log('Producto agregado a DB'))
                            .catch((err: any) => console.log(err))
                            // .finally(() => knexInstance.destroy())
                    res.status(200).json(prod)
                    return
                } 
                res.send(`{ error : -1, descripcion: ruta '/productos' método 'agregar' no autorizado }`)
            })
            .put(jsonParser, async (req: Request, res: Response) => {
                if (this.isAdmin) {
                    const idProducto = req.params.id
                        await knexInstance('producto').where('id', idProducto)
                        .then((item: any) => {
                            if (item.length == 0) {
                                res.send(`{error: 'producto no encontrado'}`)
                                return
                            } else {
                                let timestamp = Date.now()
                                const {nombre, precio, foto, descripcion, codigo, stock} = req.body
                                let prod = {
                                    timestamp,
                                    nombre,
                                    precio: parseInt(precio),
                                    foto,
                                    descripcion,
                                    codigo,
                                    stock: parseInt(stock)
                                }
                                knexInstance('producto').where({ id: parseInt(idProducto) }).update(prod)
                                    .then(() => console.log('Producto modificado en DB'))
                                    .catch((err: any) => console.log(err))
                                res.status(200).json(prod)
                            }
                        })
                        .catch((err: any) => console.log(err))
                return
                }
                res.send(`{ error : -1, descripcion: ruta '/productos' método 'modificar' no autorizado }`)
            })
            .delete(async (req: Request, res: Response) =>{
                if (this.isAdmin) {
                    const idProducto = req.params.id
                    let prod = await knexInstance('producto').where('id', idProducto)
                                .catch((err: any) => console.log(err))
                    await knexInstance('producto').where({ id: parseInt(idProducto) }).del()
                    res.send(prod)
                    return
                } 
                res.send(`{ error : -1, descripcion: ruta '/productos' método 'borrar' no autorizado }`)
            })

        return this.app
    }
}
