const ApiProductos = require( '../api/ApiProductos.js')
const loggerInfo = require('pino')();
const loggerWarn = require('pino')('warn.log');
const loggerError = require('pino')('error.log');


class ControladorProductosTienda {

    constructor() {
        this.apiProductos = new ApiProductos()
    }


    obtenerProductos = async () => {
        try {
            let reqProds = await this.apiProductos.obtenerProductos()
            if (reqProds.length == 0) {
                return [];
            } else {
                return reqProds;
            }
        }
        catch(error) {
            loggerError.error('error obtenerProductos: ' + error)
        }
    }
    
    obtenerProductosById = async ({_id}) => {
        try {
            let id = _id
            let reqProds = await this.apiProductos.obtenerProductosById(id)
            return reqProds
        }
        catch(error) {
            loggerError.error('error obtenerProductos: ' + error)
        }
    }

    actualizarStock = async ({_id, _cant}) => {
            try {
                let cant = _cant
                let id = _id
                //console.log(Producto)
                let ProductoActualizado = await this.apiProductos.actualizarProducto(id,cant)
                return ProductoActualizado
            }
            catch(error) {
                console.log('error obtenerProductos', error)
            }
        return `{ error : -1, descripcion: ruta '/productos' método 'modificar' no autorizado }`
    }

}

module.exports = ControladorProductosTienda


