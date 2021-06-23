class DbClient {
    async connect() {
        throw new Error("Falta implementar 'connect' en subclase!!")
    }

    async disconnect() {
        throw new Error("Falta implementar 'disconnect' en subclase!!")
    }
}