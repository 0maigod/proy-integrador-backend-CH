const dotenv = require('dotenv').config();

module.exports = {

  NODE_ENV: process.env.NODE_ENV || 'development',
  TIPO_PERSISTENCIA: process.env.TIPO_PERSISTENCIA || 'MEM',
  HOST: process.env.HOST || '127.0.0.1',
  PORT: process.env.PORT || 3000,
  SECRET: process.env.SECRET,
  MONGO_DB: process.env.MONGO_DB,
  PASS_GMAIL: process.env.PASS_GMAIL,
  TWILIO_SID: process.env.TWILIO_SID,
  TWILIO_TOKEN: process.env.TWILIO_TOKEN,
  TITULO: process.env.TITULO
  
}