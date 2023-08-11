const {Router} = require('express')
const {check, validationResult} = require('express-validator')
const router = Router()
const CaseStudy = require('../models/CaseStudy')
const Page = require('../models/Page')

router.post(
    '/publish', 
    [
        check('titleBig', 'The title is required.').exists(),
        check('titleSmall', 'The title is required.').exists(),
    ],
    async (req,res) => {
    try {         
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).json({ 
                errors: errors.array(),
                message: 'Incorrect details. Try again.'
            })
        } 

        const {titleBig,titleSmall,hashtags} = req.body 
        let {body} = req.body

        const empty = !!body.length
        if (!empty) return res.status(400).json({ message: 'You cannot submit an empty Case Study.' })

        body = body.filter(b => b.text.length>0) 

        const casestudy = new CaseStudy({titleBig,titleSmall,hashtags,body})
        await casestudy.save()

        res.json({casestudy})

    } catch (e) {
        res.status(500).json({message: `${e}` || `Something went wrong, try again.`})
    }
})

router.get('/', async (req,res) => {
    try {  
        const casestudies = await CaseStudy.find({})
        res.json({casestudies}) 
    } catch (e) {
        res.status(500).json({message: `${e}` || `Something went wrong, try again.`})
    } 
})
 
router.get('/:id', async (req,res) => {
    try {  
        const id = req.params.id
        const casestudy = await CaseStudy.findById(id)
        const page = await Page.findOne({page: 'work'})
        const article = page.article
        res.json({casestudy,article})
    } catch (e) {
        res.status(500).json({message: `${e}` || `Something went wrong, try again.`})
    } 
}) 

router.post('/delete', async (req,res) => {
    try {
        const {id} = req.body
        const casestudy = await CaseStudy.findByIdAndDelete(id)
        res.json({}) 
    } catch (e) {
        res.status(500).json({message: `${e}` || `Something went wrong, try again.`})
    }
})

router.post('/update', async (req,res) => {
    try {  
        const {id,form} = req.body

        const casestudy = await CaseStudy.findByIdAndUpdate(id, {titleBig: form.titleBig, titleSmall: form.titleSmall, body: form.body})
        res.json({casestudy}) 
    } catch (e) {  
        res.status(500).json({message: `${e}` || `Something went wrong, try again.`})
    } 
})
 
module.exports = router 
