const {Router} = require('express')
const {check, validationResult} = require('express-validator')
const router = Router()
const Page = require('../models/Page')
const path = require('path')
const multer = require('multer')
const fs = require('fs')

//const ROOT_PATH = path.join(__dirname, '../..'); 
//const ROOT_PATH = path.join(__dirname, '..'); 
const ROOT_PATH = path.resolve(__dirname, '..', '..');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // cb(null, path.join(__dirname, '../../client/src/assets')); 
        //cb(null, path.join(ROOT_PATH, 'client/src/assets'));  
        cb(null, path.join(ROOT_PATH, 'client', 'src', 'assets'));
    },
    filename: function (req, file, cb) {
        // const timestamp = Date.now();
        // const ext = path.extname(file.originalname); 
        // const newFilename = `${timestamp}${ext}`;
        // cb(null, newFilename);
        const newFilename = file.originalname;
        cb(null, newFilename);
    },
});

const upload = multer({ 
    storage: storage,
    limits: { fieldSize: 25 * 1024 * 1024 }, // Set a reasonable limit
});

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
        res.status(500).json({
            message: `${e}` || `Something went wrong, try again.`
            // data: `req.params: ${req.params}
            // name: ${req.params.name}
            // page: ${page}`
        })
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
router.post('/change-file',  upload.single('file'),  async (req,res) => {

    try {

        if (!req.file) {
            return res.status(400).json({ msg: 'No file uploaded' })
        }
    
        const uploadedFilePath = req.file.path; 
        //const existingFilePath = path.join(__dirname, `../../client/src/assets/${req.body.name}`)  
        const existingFilePath = path.join(ROOT_PATH, `client/src/assets/${req.body.name}`);
    
        console.log(req.body); 
        console.log(req.body.name); 
        console.log(existingFilePath);   
        console.log(fs.existsSync(existingFilePath))     

        if (fs.existsSync(existingFilePath)) {
            fs.unlink(existingFilePath, (error) => {
              if (error) { 
                console.error('Error deleting existing file:', error);
                return res.status(500).json({ msg: 'Error deleting existing file.' });
              }

            const newFilePath = path.join(path.dirname(existingFilePath), req.body.name);
            console.log(newFilePath)
            fs.rename(uploadedFilePath, newFilePath, (renameError) => {
              if (renameError) { 
                console.error('Error renaming uploaded file:', renameError);
                return res.status(500).json({ msg: 'Error renaming uploaded file.' });
              }

            console.log('File replaced and renamed:', newFilePath);

            res.json({ msg: 'File replaced and renamed successfully.' });
            });
        });
        } else {
            console.error('File does not exist:', error);
            res.json({ msg: 'File does not exist.' });
        }

    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ msg: 'Server error' });
    }
}) 
module.exports = router
