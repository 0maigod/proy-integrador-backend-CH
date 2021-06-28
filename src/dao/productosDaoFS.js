const ProductosDao = require('./ProductosDao.js')
const prods = require('../models/Producto.js')
const CustomError = require('../utils/CustomError.js')
const fs = require('fs')

class ProductosDaoFS extends ProductosDao {
    constructor() {
        super()
        // ( async () => {
        //     try {
        //         await fs.promises.readFile('productos.txt')
        //     }
        //     catch {
        //         await fs.promises.writeFile('productos.txt', JSON.stringify([]))
        //     }
        // })()
    }
    async getAll() {
        console.log('Devolviendo los productos desde el file')
        try {
            // await fs.promises.writeFile('productos.txt', JSON.stringify(productos))
            const productos = await fs.promises.readFile('./productos.txt', 'utf-8')
            console.log(productos)
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
        try {
            const productoAdd = new prods(prodNuevo)
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
            await fs.promises.writeFile('productos.txt', '')
        } catch (error) {
            throw new CustomError(500, `error al borrar a todos los productos`, error)
        }
    }

    async updateById(idParaReemplazar, nuevoProd) {
        let result
        try {
            const productos = JSON.parse(await fs.promises.readFile('productos.txt'))
        } catch (error) {
            throw new CustomError(500, `error al reemplazar al producto`, error)
        }

        if (!result) {
            throw new CustomError(404, `no se encontró para actualizar un producto con id: ${idParaReemplazar}`, { idParaReemplazar })
        }

        return json(`{esta funcion deberia hacer un patch en el archivo}`)
    }

    
}

module.exports = ProductosDaoFS