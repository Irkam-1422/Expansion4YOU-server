const {Schema, model} = require('mongoose')

const casestudySchema = new Schema({
    titleBig: {type: String,required: true},
    titleSmall: {type: String,required: true},
    hashtags: [{type: String}], 
    body: [{ 
        type: {type: String},
        text: {type: String}
    }]
})

module.exports = model('CaseStudy', casestudySchema)
