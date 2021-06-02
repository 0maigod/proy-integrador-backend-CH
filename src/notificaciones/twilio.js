const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;
const client = require('twilio')(accountSid, authToken);
const loggerInfo = require('pino')();

const enviarWAm = (usuario,mensaje) => {
    let message = 'Mensaje de ' + usuario + '. Mensaje: ' + mensaje
    client.messages.create({
        body: message,
        mediaUrl: ['https://www.investingmoney.biz/public/img/art/xl/18012019161021Twilio-IoT.jpg'],
        from: 'whatsapp:+14155238886',
        to: 'whatsapp:+5491141645307'
        })
  .then(message => loggerInfo.info(`Twilio enviado: ${message.sid}`))
  .catch(console.log)

}

module.exports = { enviarWAm }

