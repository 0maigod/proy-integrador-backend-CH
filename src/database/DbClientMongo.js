const CustomError = require('../utils/CustomError')
const mongoose = require('mongoose')
const DbClient = require('./DbClient')

class MyMongoClient extends DbClient {
    constructor() {
        super()
        this.connected = false
        this.client = mongoose
    }

    async connect() {
        try {
            await this.client.connect(process.env.MONGO_DB, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                keepAlive: true
                // useFindAndModify: false,
                // useCreateIndex: true
            })
            console.log('base de datos conectada con MyMongoClient')
        } catch (error) {
            throw new CustomError(500, 'error al conectarse a mongoDb 1', error)
        }
    }

    async disconnect() {
        try {
            await this.client.connection.close()
            console.log('base de datos desconectada')
            this.connected = false
        } catch (error) {
            throw new CustomError(500, 'error al conectarse a mongoDb 2', error)
        }
    }
}

module.exports = MyMongoClient