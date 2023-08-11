const {Router} = require('express')
const {check, validationResult} = require('express-validator')
const router = Router()
const Page = require('../models/Page')


router.get('/', async (req,res) => {
    try {  
        const pages = await Page.find({})
        res.json({pages})  
    } catch (e) {
        res.status(500).json({message: `${e}` || `Something went wrong, try again.`})
    }
})

router.get('/:name', async (req,res) => {
    try {  
        const name = req.params.name.slice(1)
        const page = await Page.findOne({page: name})
        res.json({page})
    } catch (e) {
        res.status(500).json({message: `${e}` || `Something went wrong, try again.`})
    } 
})

router.get('/get-article', async (req,res) => {
    try {
        //const page = await Page.findOne({page: 'work'})
        const page = await Page.findOne({page: 'work'})
        //const article = page.article
        console.log('page:',page)
        //console.log('article:',article)
        //res.json({article: article})  
    } catch (e) { 
        res.status(500).json({message: `${e}` || `Something went wrong, try again.`})
    }
})

router.post('/set-article', async (req,res) => {
    try {
        //console.log(req.body)
        const article = req.body.name
        console.log(article)
        const page = await Page.findOneAndUpdate({page: 'work'}, {article: article})
        console.log(page)
        res.json({page})
    } catch (e) {
        res.status(500).json({message: `${e}` || `Something went wrong, try again.`})
    }
})


router.post(
    '/update', 
    async (req,res) => {
    try { 
        const {id,form} = req.body 
        const page = await Page.findByIdAndUpdate(id, {components: form})
        res.json({page})

    } catch (e) {
        res.status(500).json({message: `${e}` || `Something went wrong, try again.`})
    }
})

router.post(
    '/add-service', 
    async (req,res) => {
    try { 
        const {page,form,titles} = req.body 
        const parent = 'services'
        const components = [form.body[0]].concat(form.body.slice(1,-1).map((b,i) => { 
            return {content: b.content, title: titles[i]}
            }), [form.body[form.body.length-1]]) 

        const servicesPage = await Page.findOne({page: 'services'})
        servicesPage.components[0].content.push(form.title)
        await servicesPage.save()

        const newPage = new Page({page, components, parent})  
        await newPage.save()

        res.json({servicesPage})

    } catch (e) {
        res.status(500).json({message: `${e}` || `Something went wrong, try again.`})
    }
})

router.post(
    '/delete-service', 
    async (req,res) => {
    try { 
        const {name,title} = req.body 

        const servicesPage = await Page.findOne({page: 'services'})
        servicesPage.components[0].content = servicesPage.components[0].content.filter(c => c[0]!==title)
        await servicesPage.save()

        const toDelete = await Page.findOneAndRemove({page: name})  

        res.json({services: servicesPage, msg: 'Deleted!'}) 

    } catch (e) {
        res.status(500).json({message: `${e}` || `Something went wrong, try again.`})
    }
})

module.exports = router
