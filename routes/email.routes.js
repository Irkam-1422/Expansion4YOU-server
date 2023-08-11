const {Router} = require('express')
const router = Router()
const mailer = require('../nodemailer') 

router.post('/send', async (req,res) => {
    console.log(req.body)
    if (!req.body) res.status(400).json({message: `${e}` || `The body is empty.`})
    const message = {
        from: req.body.email, 
        to: 'Mailer Test <cale.kirlin@ethereal.email>',
        subject: 'Congratulations',
        text: `Here you can find all the details needed to access your new Ethereal test account. 
        Remember that if sending messages through SMTP then no message is actually delivered, 
        all messages are caught and you can see these in the 
        Messages page or by using your favorite IMAP/POP3 client.`
    }
    mailer(message)
})

module.exports = router