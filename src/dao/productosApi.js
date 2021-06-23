const ProductosDaoDB = require('./productosDaoDB')

const opcion = process.argv[2] || 'Mongo'
class ProductosApi {

    constructor () {
        // switch(opcion) {
        //     case 'Mem': this.productosDao =new productosMemory()
        //     case 'File': this.productosDao = new productosFileSystem()
        //     case 'Mongo': this.productosDao = new productosDaoDb()
        // }
        this.productosDao = new productosDaoDb()
    }
    
    async agregar (prodParaAgregar) {
        const prodAgregado = await this.productosDao.add(prodParaAgregar)
        return prodAgregado
    }
    
    async buscar (id) {
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

exports.module = ProductosApi