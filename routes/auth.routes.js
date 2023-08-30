const {Router} = require('express')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
const router = Router()
const User = require('../models/User')

// /api/auth
router.get('/', (req, res) => {
    try {
      //console.log('config:', config)  
      const jwtSecret = config.get("jwtSecret"); // Access jwtSecret from config
      //const jwtSecret = process.env.jwtSecret;
      res.send(`jwtSecret: ${jwtSecret}`);
    } catch (error) {
      res.status(500).send(`Error accessing jwtSecret: ${error}`);
    }
});

router.post(
    '/login', 
    [
        check('email', 'This email is not valid').normalizeEmail().isEmail(),
        check('password', 'This field is required').exists()
    ],
    async (req,res) => {
    try {         
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).json({
                errors: errors.array(),
                message: 'Incorrect login details. Try again.'
            })
        }

        const {email,password} = req.body 

        //console.log(req.body);
        const user = await User.findOne({email})
        if (!user) return res.status(400).json({ message: 'Incorrect email' })
        
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).json({ message: 'Incorrect password' })

        const token = jwt.sign(
            {userId: user.id},  
            config.get('jwtSecret'),
            //process.env.jwtSecret,
            {expiresIn: '1h'} 
        )
        
        console.log({token, userId: user.id})
        res.json({token, userId: user.id})

    } catch (e) {
        res.status(500).json({message: `${e}` || `Something went wrong, try again.`})
    }
})

module.exports = router