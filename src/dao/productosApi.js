const ProductosDaoFS = require('./productosDaoFS')
// const ProductosDaoDb = require('./productosDaoDB')

const opcion = process.argv[2] || 'Mongo'

class ProductosApi {

    constructor () {
        switch(opcion) {
            case 'Mem': this.productosDao =new productosMemory()
            case 'File': this.productosDao = new ProductosDaoFS()
            // case 'Mongo': this.productosDao = new ProductosDaoDb()
        }
        // this.productosDao = new ProductosDaoDb()
    }
    
    async agregar (prodParaAgregar) {
        const prodAgregado = await this.productosDao.add(prodParaAgregar)
        return prodAgregado
    }
    
    async buscar (id) {
        console.log('En que esta?: ' + opcion)
        let productos
        if (id) {
            productos = await this.productosDao.getById(id)
        } else {
            productos = await this.productosDao.getAll()
        }
        return productos
    }

    async borrar (id) {
        if (id) {
            await this.productosDao.deleteById(id)
        } else {
            await this.productosDao.deleteAll()
        }
        return 'Producto/s Borrado/s'
    }

    async reemplazar (id, prodParaReemplazar) {
        const prodReemplazado = await this.productosDao.updateById(id, prodParaReemplazar)
        return prodReemplazado
    }

    exit() {
        this.productosDao.exit()
    }
}

module.exports = ProductosApi