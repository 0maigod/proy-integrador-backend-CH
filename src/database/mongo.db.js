const mongoose = require('mongoose');

async function database() {
    try {
        await mongoose.connect(process.env.MONGO_DB, {
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