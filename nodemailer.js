const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
        user: 'cale.kirlin@ethereal.email',
        pass: 'BTjhPVwY9Nm5nUmscH'
    }
})

const mailer = message => {
    transporter.sendMail(message, (err,info) => {
        if (err) console.log(err)
        console.log('Email sent:', info)
    })
}

module.exports = mailer