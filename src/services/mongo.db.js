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

module.exports = {database};
// //----------------------------------

// const mongoose = require('mongoose');
// mongoose.Promise = global.Promise;
// let isConnected;

// module.exports = database = (databaseName = process.env.DBNAME) => {
//   if (isConnected) {
//     console.log('=> usando la coneccion a la base de datos');
//     return Promise.resolve();
//   }

//   console.log('>>> Database connected');
//   const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${encodeURIComponent(
//     process.env.MONGO_PSW)}@cluster0.6bf5k.mongodb.net/${databaseName}?retryWrites=true`;
//   return mongoose.connect(uri, { 
//             useNewUrlParser: true, 
//             keepAlive: true,
//             useUnifiedTopology: true
//         }).then((db) => {
//                 isConnected = db.connections[0].readyState;
//         });
// };
