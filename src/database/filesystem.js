const fs = require('fs')

class persistenciaFileSystem {
    constructor() {
        ;( async () => {
            try {
                await fs.promises.readFile('./productos.txt')
            }
            catch {
                await fs.promises.writeFile('./productos.txt', JSON.stringify([]))
            }
        })()
    }
    
    obtenerPersonas = async () => {
        try {
            let datos = await fs.promises.readFile('./productos.txt')
            return JSON.parse(datos)
        }
        catch(error) {
            console.log(error)
        }
    }
}

module.exports = persistenciaFileSystem