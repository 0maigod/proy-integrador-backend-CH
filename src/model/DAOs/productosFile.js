const fs  = require('fs') 
const productoDTO = require('../DTOs/productos.js') 
const ProductosBaseDAO = require('./ProductosDao.js') 

class ProductosFileDAO extends ProductosBaseDAO {

    constructor(nombreArchivo) {
        super()
        this.nombreArchivo = nombreArchivo
    }

    async leer(archivo) {
        return JSON.parse(await fs.promises.readFile(archivo,'utf-8'))
    }

    async guardar(archivo,productos) {
        await fs.promises.writeFile(archivo, JSON.stringify(productos,null,'\t') )
    }

    obtenerProductos = async _id => {
        try {
            if(_id) {
                let productos = await this.leer(this.nombreArchivo)
                let index = productos.findIndex(producto => producto._id == _id)
                return index >= 0 ? [productos[index]] : []
            }
            else {
                let productos = await this.leer(this.nombreArchivo)
                return productos
            }
        }
        catch(error) {
            console.log('error en obtenerProductos:',error)
            let productos = []

            //guardo archivo
            await this.guardar(this.nombreArchivo,productos)
            return productos
        }
    }

    guardarProducto = async producto => {
        try {
            //leo archivo
            let productos = await this.leer(this.nombreArchivo)

            let _id = this.getNext_Id(productos)
            let timestamp = new Date().toLocaleString()
            let productoGuardado = productoDTO(producto,_id,timestamp)
            productos.push(productoGuardado)

            //guardo archivo
            await this.guardar(this.nombreArchivo,productos)

            return productoGuardado
        }
        catch(error) {
            console.log('error en guardarProducto:',error)
            let producto = {}

            return producto
        }
    }

    actualizarProducto = async (_id,producto) => {
        try {
            //leo archivo
            let productos = await this.leer(this.nombreArchivo)

            let timestamp = new Date().toLocaleString()
            let productoNew = productoDTO(producto,_id,timestamp)

            let indice = this.getIndex(_id,productos)
            let productoActual = productos[indice] || {}

            let productoActualizado = {...productoActual,...productoNew}

            indice >=0 ? 
                productos.splice(indice,1,productoActualizado) :
                productos.push(productoActualizado)

            //guardo archivo
            await this.guardar(this.nombreArchivo,productos)

            return productoActualizado
        }
        catch(error) {
            console.log('error en actualizarProducto:',error)
            let producto = {}

            return producto
        }

    }

    borrarProducto = async _id => {
        try {
            //leo archivo
            let productos = await this.leer(this.nombreArchivo)

            let indice = this.getIndex(_id,productos)
            let productoBorrado = productos.splice(indice,1)[0]

            //guardo archivo
            await this.guardar(this.nombreArchivo,productos)

            return productoBorrado
        }
        catch(error) {
            console.log('error en borrarProducto:',error)
            let producto = {}

            return producto
        }
    }
}

module.exports = ProductosFileDAO