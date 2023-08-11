const {Schema, model} = require('mongoose')

const pageSchema = new Schema({
    page:  {type: String,required: true},
    components: [{
        title: {type: String,required: true},
        content: [{type: [String]}]
    }],
    parent:  {type: String},
    article:  {type: String}
}) 

module.exports = model('Page', pageSchema)

/*
"page":  "page",
"components": [
    {"title": "title",
    "content": [
      {"text": "text"},
      {"text": "text"},
      {"text": "text"},
      {"text": "text"},
      {"text": "text"},
      {"text": "text"},
      {"text": "text"},
      {"text": "text"},
      {"text": "text"},
      {"text": "text"},
      {"text": "text"}
    ]}
  ]
*/