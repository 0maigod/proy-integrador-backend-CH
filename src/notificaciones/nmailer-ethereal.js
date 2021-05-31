const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    // requireTLS: true,
    auth: {
        user: 'adan34@ethereal.email',
        pass: 'ZnP5ERSSPPEQJ7m1KG'
    },
    tls : { rejectUnauthorized: false }
});

const enviarMail = (asunto,mensaje,cb) => {
    const mailOptions = {
        from: 'Servidor Node.js',
        to: 'adan34@ethereal.email',
        subject: asunto,
        html: mensaje
    }
    
    transporter.sendMail(mailOptions, (err, info) => {
        cb(err,info)
    })
}

module.exports = { enviarMail }
