class productosMemory {
    constructor() {
        this.personas = []
    }
    obtenerPersonas = async () => {
        return this.personas
    }
    agregarPersona = async persona => {
        this.personas.push(persona)
    }
}

module.exports = productosMemory