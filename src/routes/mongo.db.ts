import mongoose from 'mongoose';

async function database() {
    try {
        await mongoose
            .connect('mongodb://localhost:27017/ecommerce', {
                useNewUrlParser: true,
                user: 'admin',
                pass: 'secret',
                keepAlive: true,
                useUnifiedTopology: true
            })
            .then(() => console.log('>>> Database connected'));
    } catch {
        // (e: any) => console.log(e);
        console.log('Error');
    }
}

export default database;
