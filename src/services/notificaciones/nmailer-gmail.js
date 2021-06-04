const nodemailer = require('nodemailer') 

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'profesore2020@gmail.com',
        pass: process.env.PASS_GMAIL
    },
    tls : { rejectUnauthorized: false }
});

const enviarGmail = (asunto,mensaje,cb) => {
    const mailOptions = {
        from: 'Servidor Node.js',
        to: 'profesore2020@gmail.com',
        subject: asunto,
        html: mensaje,
        // attachments: [
        //     {   
        //         path: adjunto,
        //         filename: 'foto.jpg',
        //     }
        // ]        
    }
    
    transporter.sendMail(mailOptions, (err, info) => {
        cb(err,info)
    })
}

module.exports = { enviarGmail }