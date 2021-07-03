const mongoose = require('mongoose');
const config = require('../config.js')

async function database() {
    try {
        await mongoose.connect(config.MONGO_DB, {
            useNewUrlParser: true,
            keepAlive: true,
            useUnifiedTopology: true
        });
        console.log('>>> Database connected');
    } catch (err) {
        console.log(err);
    }
}

module.exports = database;