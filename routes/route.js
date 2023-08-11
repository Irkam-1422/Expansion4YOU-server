const express = require('express')
const router = express.Router()

router.get("/", (req,res) => {
    res.send("Egnite your business growth!");
    })
    
module.exports = router 