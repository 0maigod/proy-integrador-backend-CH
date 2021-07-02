const ProductosDao = require('./ProductosDao.js')
const ProductosDB = require('../models/ProductoMongo')
// const productoDTO = require('../DTOs/productos')
const MyMongoClient = require('../../database/DbClientMongo.js')

// const CustomError = require('../utils/CustomError.js')


class ProductosDaoDb extends ProductosDao {

    constructor(){
        super()
        this.client = new MyMongoClient()
        this.client.connect()
    }

    obtenerProductos = async _id => {
        console.log('Devolviendo los productos desde el mongo')
        try {
            if(_id) {
                console.log(_id)
                const producto = await ProductosDB.findOne({ _id: _id })
                console.log(producto)
                return [producto]
            }
            else {
                const productos = await ProductosDB.find()
                return productos;
            }
        }
        catch(error) {
            console.log('obtenerProductos error', error)
        }
    }

    guardarProducto = async producto => {
        try{
            await productoAdd.save(producto)
            return producto
        }
        catch(error) {
            console.log('guardarProducto error', error)
            return producto
        }

    }

    borrarProducto = async _id => {
        try {
            const productoBorrado = await ProductosDB.findOne({ _id: _id })
            await ProductosDB.deleteOne({ _id: _id })
            return productoBorrado
        }
        catch(error) {
            console.log('borrarProducto error', error)
            return productoBorrada
        }        
    }

    actualizarProducto = async (_id, producto) => {
        try {
            await ProductosDB.findOneAndReplace({ _id: _id }, producto )
            return producto
        }
        catch(error) {
            console.log('actualizarProducto error', error)
            return producto
        }
    }

    exit() {
        this.client.disconnect()
    }
}

module.exports = ProductosDaoDb