const mongoose = require('mongoose');

async function database() {
    try {
        await mongoose.connect('mongodb+srv://cluster0.wekjp.mongodb.net/ecommerce?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            user: 'omero',
            pass: 'Urkrb9RrNJi6vuZ',
            keepAlive: true,
            useUnifiedTopology: true
        });
        console.log('>>> Database connected');
    } catch (err) {
        console.log(err);
    }
}

module.exports = database;
