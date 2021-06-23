const ProductosDao = require('./ProductosDAO.js')
const productos = require('../models/Producto.js')
const CustomError = require('../utils/CustomError.js')
const MyMongoClient = require('../database/DbClientMongo.js')


class ProductosDaoDb extends ProductosDao {

    constructor(){
        super()
        this.client = new MyMongoClient()
        this.client.connect()
    }

    async getAll() {
        try {
            const productos = await productos.find().lean()
            return productos
        } catch (err) {
            throw new CustomError(500, 'error al obtener todos los productos', err)
        }
    }

    async getById(idBuscado) {
        let producto
        try {
            producto = await productos.findOne({ _id: idBuscado })
        } catch (err) {
            throw new CustomError(500, 'error al buscar producto por dni', err)
        }

        if (!producto) {
            throw new CustomError(404, 'producto no encontrado con ese ID', { id: idBuscado })
        }

        return [producto]
    }

    async add(prodNuevo) {
        let result
        try {
            const productoAdd = new productos(prodNuevo)
            result = await productoAdd.save()
        } catch (error) {
            throw new CustomError(500, 'error al crear un nuevo producto', error)
        }
        return prodNuevo
    }

    async deleteById(idParaBorrar) {
        let result
        try {
            result = await productos.deleteOne({ _id: idParaBorrar })
        } catch (error) {
            throw new CustomError(500, `error al borrar producto`, error)
        }

        if (result.deletedCount == 0) {
            throw new CustomError(404, `no existe un producto para borrar con id: ${idParaBorrar}`, { idParaBorrar })
        }
    }

    async deleteAll() {
        try {
            await productos.deleteMany()
        } catch (error) {
            throw new CustomError(500, `error al borrar a todos los productos`, error)
        }
    }

    async updateById(idParaReemplazar, nuevoProd) {
        let result
        try {
            result = await productos.findOneAndReplace({ _id: idParaReemplazar }, nuevoProd )
        } catch (error) {
            throw new CustomError(500, `error al reemplazar al producto`, error)
        }

        if (!result) {
            throw new CustomError(404, `no se encontró para actualizar un producto con id: ${idParaReemplazar}`, { idParaReemplazar })
        }

        return nuevoProd
    }
    exit() {
        this.client.disconnect()
    }
}

export default ProductosDaoDb