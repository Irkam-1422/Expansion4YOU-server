const {Schema, model} = require('mongoose')

const articleSchema = new Schema({
    title: {type: String,required: true, unique: true},
    body: [{
        type: {type: String,required: true},
        text: {type: String,required: true}
    }]
})

module.exports = model('Article', articleSchema)