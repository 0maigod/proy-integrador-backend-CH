const CustomError = require('../utils/CustomError')
const mongoose = require('mongoose')
const DbClient = require('./DbClient')
const config = require('../config.js')

class MyMongoClient extends DbClient {
    constructor() {
        super()
        this.connected = false
        this.client = mongoose
    }

    async connect() {
        try {
            await this.client.connect(config.MONGO_DB, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                keepAlive: true
                // useFindAndModify: false,
                // useCreateIndex: true
            })
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