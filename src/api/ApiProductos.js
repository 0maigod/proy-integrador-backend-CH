const config = require('../config')
import ProductosFactoryDAO from '../model/DAOs/ProductosFactory.js'
import Productos from '../model/models/Producto';

class ApiProductos {

    constructor() {
        this.productosDAO = ProductosFactoryDAO.get(config.TIPO_PERSISTENCIA)
    }

    async obtenerProductos(id) { return await this.productosDAO.obtenerProductos(id) }

    async guardarProducto(producto) { 
        ApiProductos.asegurarProductoValido(producto,true)
        return await this.productosDAO.guardarProducto(producto) 
    }

    async actualizarProducto(id,producto) { 
        ApiProductos.asegurarProductoValido(producto,false)
        return await this.productosDAO.actualizarProducto(id,producto) 
    }
    
    async borrarProducto(id) { return await this.productosDAO.borrarProducto(id) }

    static asegurarProductoValido(producto,requerido) {
        try {
            Productos.validar(producto,requerido)
        } catch (error) {
            throw new Error('la producto posee un formato json invalido o faltan datos: ' + error.details[0].message)
        }
    }    
}

module.exports = ApiProductos
