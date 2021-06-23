const ProductosDao = require('./ProductosDAO.js')
const productos = require('../models/Producto.js')
const CustomError = require('../utils/CustomError.js')
const fs = require('fs')

class productosFileSystem extends ProductosDao {
    constructor() {
        ;( async () => {
            try {
                await fs.promises.readFile('datos.txt')
            }
            catch {
                await fs.promises.writeFile('datos.txt', JSON.stringify([]))
            }
        })()
    }
    async getAll() {
        try {
            const productos = await fs.promises.readFile('productos.txt')
            return JSON.parse(productos)
        } catch (err) {
            throw new CustomError(500, 'error al obtener todos los productos', err)
        }
    }
    
    async getById(idBuscado) {
        let producto
        try {
            const productos = JSON.parse(await fs.promises.readFile('productos.txt'))
            producto = await productos.filter({ _id: idBuscado })
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
            let productos = JSON.parse(await fs.promises.readFile('productos.txt'))
            productos.push(productoAdd)
            await fs.promises.writeFile('productos.txt', JSON.stringify(productos))
        } catch (error) {
            throw new CustomError(500, 'error al crear un nuevo producto', error)
        }
        return prodNuevo
    }

    async deleteById(idParaBorrar) {
        let result
        try {
            const productos = JSON.parse(await fs.promises.readFile('productos.txt'))
            result = productos.filter({ _id: idParaBorrar })
        } catch (error) {
            throw new CustomError(500, `error al borrar producto`, error)
        }

        if (result.length == 0) {
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

    
}

module.exports = productosFileSystem