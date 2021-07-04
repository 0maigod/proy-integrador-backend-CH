const ApiProductos = require( '../api/ApiProductos.js')
const config = require('../config')
const loggerInfo = require('pino')();
const loggerWarn = require('pino')('warn.log');
const loggerError = require('pino')('error.log');

const titulo = config.TITULO
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
            let reqProds2 = JSON.stringify(reqProds)
            
            if (reqProds.length == 0) {
                return res.status(200).render('ingresar', { productos: JSON.parse(reqProds2), listExists: false, titulo: titulo });
            } else {
                return res.status(200).render('ingresar', { productos: JSON.parse(reqProds2), listExists: true, userExists: req.session.isAdmin, user: username, titulo: titulo });
                // return res.status(200).json(JSON.parse(reqProds2));
            }
        }
        catch(error) {
            loggerError.error('error obtenerProductos: ' + error)
        }
    }

    guardarProducto = async (req,res) => {
        try {
            let Producto = req.body
            if (req.session.isAdmin) {
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
        if (req.session.isAdmin) {
            try {
                let Producto = req.body
                let id = req.params.id
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
        if (req.session.isAdmin) {
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