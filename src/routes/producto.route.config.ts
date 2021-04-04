import { Request, Response, Application, json } from 'express';
import { Producto } from '../producto';
import { CommonRoutesConfig } from './common.route.config';
import DBProducto from '../models/Producto';

const jsonParser = json();

export class ProductoRoutes extends CommonRoutesConfig {
    productos: Producto[];
    isAdmin: boolean;
    constructor(app: Application, productos: Producto[], isAdmin: boolean) {
        super(app, 'productoRoutes');
        this.productos = productos;
        this.isAdmin = isAdmin;
    }
    configureRoutes() {
        this.app
            .route('/producto/:id?')
            .get(async (req: Request, res: Response) => {
                let idProducto = req.params.id;
                let min = req.query.min;
                let max = req.query.max;
                let texto: string = req.query.text as string;
                if (texto) {
                    let regEx = new RegExp(['^', texto, '$'].join(''), 'i');
                    let reqProds: Producto[] = [];
                    await DBProducto.find({ nombre: regEx })
                        .then((rows: any[]) => {
                            rows.forEach((row) => {
                                reqProds.push(row);
                            });
                        })
                        .catch((err: any) => console.log(err));
                    res.status(200).json(reqProds);
                    return;
                }
                if (min || max) {
                    if (!min || !max) {
                        res.send(`{ error : -1, descripcion: 'Falta agregar un valor' }`);
                        return;
                    }
                    let search: object = { precio: { $gte: min, $lte: max } };
                    let reqProds: Producto[] = [];
                    await DBProducto.find(search)
                        .sort({ price: 1 })
                        .then((rows: any[]) => {
                            rows.forEach((row) => {
                                reqProds.push(row);
                            });
                        })
                        .catch((err: any) => console.log(err));
                    res.status(200).json(reqProds);
                    return;
                }
                if (!idProducto) {
                    let reqProds: Producto[] = [];
                    await DBProducto.find()
                        .then((rows: any[]) => {
                            rows.forEach((row) => {
                                reqProds.push(row);
                            });
                        })
                        .then(() => console.log(reqProds))
                        .catch((err: any) => console.log(err));
                    res.status(200).json(reqProds);
                    return;
                } else {
                    let reqProds: Producto;
                    await DBProducto.find({ _id: idProducto })
                        .then((item: any) => {
                            if (item.length == 0) {
                                res.send(`{error: 'producto no encontrado'}`);
                            } else {
                                reqProds = item;
                                res.status(200).json(reqProds);
                            }
                        })
                        .catch((err: any) => console.log(err));
                }
            })
            .post(jsonParser, async (req: Request, res: Response) => {
                if (this.isAdmin) {
                    let timestamp = Date.now();
                    const { nombre, precio, foto, descripcion, codigo, stock } = req.body;
                    const prod = new DBProducto({
                        timestamp,
                        nombre,
                        precio: parseInt(precio),
                        foto,
                        descripcion,
                        codigo,
                        stock: parseInt(stock)
                    });
                    await prod
                        .save()
                        .then(() => console.log('Producto agregado a DB'))
                        .catch((err: any) => console.log(err));
                    res.status(200).json(prod);
                    return;
                }
                res.send(`{ error : -1, descripcion: ruta '/productos' método 'agregar' no autorizado }`);
            })
            .put(jsonParser, async (req: Request, res: Response) => {
                if (this.isAdmin) {
                    const idProducto = req.params.id;
                    await DBProducto.find({ _id: idProducto })
                        .then((prod: any) => {
                            if (prod.length == 0) {
                                res.send(`{error: 'producto no encontrado'}`);
                                return;
                            } else {
                                let timestamp = Date.now();
                                const { nombre, precio, foto, descripcion, codigo, stock } = req.body;
                                let prod: Producto = {
                                    id: idProducto,
                                    timestamp,
                                    nombre,
                                    precio: parseInt(precio),
                                    foto,
                                    descripcion,
                                    codigo,
                                    stock: parseInt(stock)
                                };
                                DBProducto.updateOne({ _id: idProducto }, prod)
                                    .then(() => console.log('Producto modificado en DB'))
                                    .catch((err: any) => console.log(err));
                                res.status(200).json(prod);
                            }
                        })
                        .catch((err: any) => console.log(err));
                    return;
                }
                res.send(`{ error : -1, descripcion: ruta '/productos' método 'modificar' no autorizado }`);
            })
            .delete(async (req: Request, res: Response) => {
                if (this.isAdmin) {
                    const idProducto = req.params.id;
                    if (!idProducto) {
                        res.send(`{ error : -1, descripcion: debe ingresar el ID del producto }`);
                        return;
                    }
                    await DBProducto.find({ _id: idProducto })
                        .then((prod) => {
                            if (prod.length == 0) {
                                res.send(`{error: 'producto no encontrado'}`);
                                return;
                            } else {
                                DBProducto.deleteOne({ _id: idProducto })
                                    .then(() => res.send(prod))
                                    .catch((err: any) => console.log(err));
                                return;
                            }
                        })
                        .catch((err: any) => console.log(err));
                    return;
                }
                res.send(`{ error : -1, descripcion: ruta '/productos' método 'borrar' no autorizado }`);
            });

        this.app.route('/texto').get(async (req: Request, res: Response) => {});

        return this.app;
    }
}
