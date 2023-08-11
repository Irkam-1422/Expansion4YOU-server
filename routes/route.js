const express = require('express')
const router = express.Router()

router.get("/", (req,res) => {
    res.send("Ignite your business growth!");
    })
    
module.exports = router 