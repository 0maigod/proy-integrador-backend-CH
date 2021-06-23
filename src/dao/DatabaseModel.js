const productosMemory = require('./memoryDao.js')
const productosFileSystem =  require('./filesystemDao.js')
const persistenciaMongo = require('../database/mongo')

/* -------------------------------------- */
/*                FACTORY                 */
/* -------------------------------------- */
class FactoryDatabaseModel {
    static set(opcion) {
        console.log('**** PERSISTENCIA SELECCIONADA **** [' + opcion + ']')
        switch(opcion) {
            case 'Mem': return new productosMemory()
            case 'File': return new productosFileSystem()
            case 'Mongo': return new persistenciaMongo()
        }
    }
}

const opcion = process.argv[2] || 'Mongo'

module.exports = FactoryDatabaseModel.set(opcion)

