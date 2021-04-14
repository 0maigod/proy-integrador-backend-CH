import mongoose from 'mongoose';

async function database() {
    try {
        await mongoose.connect('mongodb+srv://cluster0.wekjp.mongodb.net/ecommerce?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            user: 'omero',
            pass: 'Urkrb9RrNJi6vuZ',
            keepAlive: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('>>> Database connected');
    } catch (e: any) {
        console.log(e);
    }
}

export default database;
