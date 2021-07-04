const ApiProductos = require( '../api/ApiProductos.js')
const config = require('../config')
const loggerInfo = require('pino')();
const loggerWarn = require('pino')('warn.log');
const loggerError = require('pino')('error.log');


const titulo = config.TITULO

class ControladorTienda {

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
        return res.status(200).render('tienda', { listExists: true, user: username, titulo: titulo });
    }

    actualizarProducto = async (req,res) => {

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

}

module.exports = ControladorTienda