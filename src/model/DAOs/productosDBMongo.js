const ProductosDao = require('./ProductosDao.js')
const ProductosDB = require('../models/ProductoMongo')
const MyMongoClient = require('../../database/DbClientMongo.js')

// const productoDTO = require('../DTOs/productos')
// const CustomError = require('../utils/CustomError.js')


class ProductosDaoDb extends ProductosDao {

    constructor(){
        super()
        ;( async () => {
            this.client = new MyMongoClient()
            this.client.connect()
        })()
    }

    obtenerProductos = async _id => {
        try {
            if(_id) {
                const producto = await ProductosDB.findOne({ _id: _id })
                return [producto]
            }
            else {
                const productos = await ProductosDB.find()
                // console.log(productos)
                return productos;
            }
        }
        catch(error) {
            console.log('obtenerProductos error', error)
        }
    }

    guardarProducto = async producto => {
        let timestamp = Date.now();
        const prod = new ProductosDB({
            ...producto,
            timestamp,
        });
        try{
            await prod.save()
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
        let timestamp = Date.now();
        const prod = {
            ...producto,
            timestamp,
        };
        try {
            await ProductosDB.updateOne({ _id: _id }, prod )
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