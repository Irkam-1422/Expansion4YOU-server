require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const route = require('./routes/route')
const cors = require('cors')

const PORT = process.env.port || 4500  
const db = "mongodb+srv://expansion4you:xH7Rd6ji1Ya413xm@cluster0.kgapqpo.mongodb.net/" 

const corsOptions = {
    origin: ['https://expansion4-you-client.vercel.app', 'http://localhost:3001'],
    methods: 'GET, POST', 
    allowedHeaders: 'Content-Type, Authorization', 
  };

const app = express()

app.use(express.json({extended: true}))
app.use(cors(corsOptions));

app.use(route)
// app.use('/', express.static(path.join(__dirname, 'client', 'build')))
// app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
// })

app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/article', require('./routes/article.routes'))
app.use('/api/content', require('./routes/content.routes'))
app.use('/api/casestudy', require('./routes/casestudy.routes'))
app.use('/api/email', require('./routes/email.routes')) 

// if (process.env.NODE_ENV === 'production') {
//     app.use('/', express.static(path.join(__dirname, 'client', 'build')))

//     app.get('*', (req, res) => {
//         res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
//     })
// }

// app.use('/api/file', require('./routes/file.routes'))  
// app.listen(PORT, () => console.log('Server has been started'))

async function start() { 
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true, 
            useUnifiedTopology: true 
        })
        console.log('Connected to DB') 
        app.use('/api/file', require('./routes/file.routes'))  
        app.listen(PORT, () => console.log('Server has been started on', PORT))
    } catch (e) {
        console.log('Server Error', e.message);
        process.exit(1)
    }
}
start()

