const persistenciaMemory = require('./memory.js')
const persistenciaFileSystem =  require('./filesystem.js')
const persistenciaMongo = require('./mongo.js')

/* -------------------------------------- */
/*                FACTORY                 */
/* -------------------------------------- */
class FactoryPersonaModel {
    static set(opcion) {
        console.log('**** PERSISTENCIA SELECCIONADA **** [' + opcion + ']')
        switch(opcion) {
            case 'Mem': return new persistenciaMemory()
            case 'File': return new persistenciaFileSystem()
            case 'Mongo': return new persistenciaMongo()
        }
    }
}

const opcion = process.argv[2] || 'Mongo'

module.exports = FactoryPersonaModel.set(opcion)

