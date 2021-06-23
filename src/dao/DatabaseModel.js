const productosMemory = require('./memory.js')
const productosFileSystem =  require('./filesystem.js')
const { default: productosDaoDb } = require('./productosDaoDB.js')

/* -------------------------------------- */
/*                FACTORY                 */
/* -------------------------------------- */
class FactoryDatabaseModel {
    static set(opcion) {
        console.log('**** PERSISTENCIA SELECCIONADA **** [' + opcion + ']')
        switch(opcion) {
            case 'Mem': return new productosMemory()
            case 'File': return new productosFileSystem()
            case 'Mongo': return new productosDaoDb()
        }
    }
}

const opcion = process.argv[2] || 'Mongo'

module.exports = FactoryDatabaseModel.set(opcion)

