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

    // async getAll() {
        
    //     try {
    //         // const productos = await productos.find().lean()
    //         const productos = await ProductosDB.find()
    //         return productos
    //     } catch (err) {
    //         // throw new CustomError(500, 'error al obtener todos los productos', err)
    //         throw console.log(err)
    //     }
    // }

    // async getById(idBuscado) {
    //     let producto
    //     try {
    //         producto = await ProductosDB.findOne({ _id: idBuscado })
    //     } catch (err) {
    //         throw new CustomError(500, 'error al buscar producto por dni', err)
    //     }

    //     if (!producto) {
    //         throw new CustomError(404, 'producto no encontrado con ese ID', { id: idBuscado })
    //     }

    //     return [producto]
    // }

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

    // async add(prodNuevo) {
    //     let result
    //     try {
    //         const productoAdd = new productos(prodNuevo)
    //         result = await productoAdd.save()
    //     } catch (error) {
    //         throw new CustomError(500, 'error al crear un nuevo producto', error)
    //     }
    //     return prodNuevo
    // }

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

    // async deleteById(idParaBorrar) {
    //     let result
    //     try {
    //         result = await ProductosDB.deleteOne({ _id: idParaBorrar })
    //     } catch (error) {
    //         throw new CustomError(500, `error al borrar producto`, error)
    //     }

    //     if (result.deletedCount == 0) {
    //         throw new CustomError(404, `no existe un producto para borrar con id: ${idParaBorrar}`, { idParaBorrar })
    //     }
    // }

    // async deleteAll() {
    //     try {
    //         await ProductosDB.deleteMany()
    //     } catch (error) {
    //         throw new CustomError(500, `error al borrar a todos los productos`, error)
    //     }
    // }

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

    // async updateById(idParaReemplazar, nuevoProd) {
    //     let result
    //     try {
    //         result = await ProductosDB.findOneAndReplace({ _id: idParaReemplazar }, nuevoProd )
    //     } catch (error) {
    //         throw new CustomError(500, `error al reemplazar al producto`, error)
    //     }

    //     if (!result) {
    //         throw new CustomError(404, `no se encontró para actualizar un producto con id: ${idParaReemplazar}`, { idParaReemplazar })
    //     }

    //     return nuevoProd
    // }

    exit() {
        this.client.disconnect()
    }
}

module.exports = ProductosDaoDb