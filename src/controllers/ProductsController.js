
// const controller = {};
// // const isAdmin = true;
// let username = '';
// let ProductosApi = new ModeloApi()
// const titulo = process.env.TITULO || 'Coderhouse desafio Final';




// controller.min_max = async (req, res) => {
//     let min = req.params.min;
//     let max = req.params.max;
//     if (!min || max) {
//         console.log('falta un precio');
//         return;
//     }
//     console.log('precio minimo ' + min);
//     console.log('precio maximo ' + max);
// }


// controller.delete = async (req, res) => {
//     if (isAdmin) {
//         const { id } = req.params;
//         if (!id) {
//             res.send(`{ error : -1, descripcion: debe ingresar el ID del producto }`);
//             return;
//         }
//         let prod = await ProductosApi.buscar({ _id: id });
//         if (prod.length == 0) {
//             res.send(`{error: 'producto no encontrado'}`);
//             return;
//         }
//         await ProductosApi.borrar({ _id: id });
//         res.send(prod);
//         return;
//     }
//     res.send(`{ error : -1, descripcion: ruta '/productos' método 'borrar' no autorizado }`);
// }


// module.exports = controller;

const ApiProductos = require( '../api/ApiProductos.js')
const loggerInfo = require('pino')();
const loggerWarn = require('pino')('warn.log');
const loggerError = require('pino')('error.log');


class ControladorProductos {

    constructor() {
        this.apiProductos = new ApiProductos()
    }


    obtenerProductos = async (req,res) => {
        req.session.touch();
        req.session.save((err) => {
            if (err) {
                loggerError.error('Error al ingresar: ' + err);
            }
        });
        try {
            let id = req.params.id
            let reqProds = await this.apiProductos.obtenerProductos(id)
            if (reqProds.length == 0) {
                res.status(200).render('ingresar', { productos: reqProds, listExists: false, titulo: titulo });
            } else {
                res.status(200).render('ingresar', { productos: JSON.parse(productos), listExists: true, userExists: isAdmin, user: username, titulo: titulo });
            }
        }
        catch(error) {
            loggerError.error('error obtenerProductos: ' + error)
        }
    }

    guardarProducto = async (req,res) => {
        try {
            let Producto = req.body
            // console.log(Producto)
            if (isAdmin) {
                let ProductoGuardado = await this.apiProductos.guardarProducto(Producto)
                loggerInfo.info('Producto agregado a DB');
            return res.status(200).render('ingresar', { productos: ProductoGuardado, listExists: true, userExists: true, titulo: titulo });
            } else {
                res.send(`{ error : -1, descripcion: ruta '/productos' método 'agregar' no autorizado }`);
            }
        }
        catch(error) {
            console.log('error obtenerProductos', error)
        }
    }

    actualizarProducto = async (req,res) => {
        if (isAdmin) {
            try {
                let Producto = req.body
                let id = req.params.id
                //console.log(Producto)
                let ProductoActualizado = await this.apiProductos.actualizarProducto(id,Producto)
                return res.status(200).json(ProductoActualizado)
            }
            catch(error) {
                console.log('error obtenerProductos', error)
            }
        }
        return res.send(`{ error : -1, descripcion: ruta '/productos' método 'modificar' no autorizado }`)
    }



    borrarProducto = async (req,res) => {
        if (isAdmin) {
            try {
                let id = req.params.id
                let ProductoBorrado = await this.apiProductos.borrarProducto(id)
                return res.json(ProductoBorrado)
            }
            catch(error) {
                console.log('error obtenerProductos', error)
            }
        }
        return res.send(`{ error : -1, descripcion: ruta '/productos' método 'borrar' no autorizado }`);
    }
}

module.exports = ControladorProductos