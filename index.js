const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const config = require('config')
const path = require('path')
const fileUpload = require('express-fileupload')

const PORT = config.get('port') || 5000
const db = 'mongodb+srv://expansion4you:xH7Rd6ji1Ya413xm@cluster0.kgapqpo.mongodb.net/'

const app = express()

app.use(express.json({extended: true}))
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/article', require('./routes/article.routes'))
app.use('/api/content', require('./routes/content.routes'))
app.use('/api/casestudy', require('./routes/casestudy.routes'))
app.use('/api/email', require('./routes/email.routes'))  

if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'client', 'build')))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

async function start() { 
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true, 
            useUnifiedTopology: true
        })
        // di4italmarke4ing
        //const password = await bcrypt.hash('12345', 12)
        console.log('Connected to DB') 
        app.listen(PORT, () => console.log('Server has been started'))
    } catch (e) {
        console.log('Server Error', e.message);
        process.exit(1)
    }
}
start()

