const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
let isConnected;

module.exports = database = (databaseName = process.env.DBNAME) => {
    
  if (isConnected) {
    console.log('=> usando la coneccion ya activada base de datos');
    return Promise.resolve();
  }

  console.log('>>> Database connected');

  const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${encodeURIComponent(
    process.env.MONGO_PSW)}@cluster0.wekjp.mongodb.net/${databaseName}?retryWrites=true`;

  return mongoose.connect(uri, { 
            useNewUrlParser: true, 
            keepAlive: true,
            useUnifiedTopology: true
        }).then((db) => {
                isConnected = db.connections[0].readyState;
        });
};
