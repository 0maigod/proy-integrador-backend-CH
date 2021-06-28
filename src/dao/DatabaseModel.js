const productosMemory = require('./memoryDao.js')
const persistenciaFileSystem =  require('../database/filesystem.js')
const persistenciaMongo = require('../database/mongo')

/* -------------------------------------- */
/*                FACTORY                 */
/* -------------------------------------- */
class FactoryDatabaseModel {
    static set(opcion) {
        console.log('**** PERSISTENCIA SELECCIONADA **** [' + opcion + ']')
        switch(opcion) {
            case 'Mem': return new productosMemory()
            case 'File': return new persistenciaFileSystem()
            case 'Mongo': return new persistenciaMongo()
        }
    }
}

// const opcion = process.argv[2] || 'Mongo'
const opcion = 'Mongo'

module.exports = FactoryDatabaseModel.set(opcion)

