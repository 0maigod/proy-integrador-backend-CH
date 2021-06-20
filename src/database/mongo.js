const mongoose = require('mongoose');

class persistenciaMongo {
  constructor() {
    this._connect()
  }
  
_connect() {
     mongoose.connect(process.env.MONGO_DB, {
                                useNewUrlParser: true,
                                keepAlive: true,
                                useUnifiedTopology: true
                            })
       .then(() => {
         console.log('Database connection successful')
       })
       .catch(err => {
         console.error('Database connection error')
       })
  }
}

module.exports = persistenciaMongo