const {Router} = require('express')
const {check, validationResult} = require('express-validator')
const router = Router()
const path = require('path')
const Article = require('../models/Article')
const Page = require('../models/Page')
const fs = require('fs')
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../client/src/assets'));
    },
    filename: function (req, file, cb) {
        const timestamp = Date.now();
        const ext = path.extname(file.originalname); 
        const newFilename = `${timestamp}${ext}`;
        cb(null, newFilename);
    },
});
const upload = multer({ 
    storage: storage,
    limits: { fieldSize: 25 * 1024 * 1024 }, // Set a reasonable limit
});

router.post(
    '/publish', 
    [
        check('title', 'The title is required.').exists(),
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

        const {title,body} = req.body 

        const exist = await Article.findOne({title})
        if (exist)return res.status(400).json({ message: 'Article with this title already exists.' })

        const article = new Article({title,body})
        await article.save()

        res.json({article})

    } catch (e) {
        res.status(500).json({message: `${e}` || `Something went wrong, try again.`})
    }
})

router.get('/', async (req,res) => {
    try {  
        const articles = await Article.find({})
        const page = await Page.findOne({page: 'work'})
        const main = page.article
        res.json({articles,main}) 
    } catch (e) {
        res.status(500).json({message: `${e}` || `Something went wrong, try again.`})
    }
})

router.get('/:name', async (req,res) => {
    try {  
        let title = req.params.name.split('-').join(' ')
        let articles = await Article.find({})
        let article = articles.filter(a => a.title.includes(title))[0] 
        res.json({article})  
    } catch (e) {
        res.status(500).json({message: `${e}` || `Something went wrong, try again.`})
    } 
})

router.post('/delete', async (req,res) => {
    try {
        const {id} = req.body
        const article = await Article.findByIdAndDelete(id)
        res.json({})
    } catch (e) {
        res.status(500).json({message: `${e}` || `Something went wrong, try again.`})
    }
})

router.post('/update', async (req,res) => {
    try {  
        const {id,form} = req.body

        const article = await Article.findByIdAndUpdate(id, {title: form.title, body: form.body})
        res.json({article})
    } catch (e) {  
        res.status(500).json({message: `${e}` || `Something went wrong, try again.`})
    } 
})

router.post('/form',  upload.single('file'),  async (req,res) => {

    if (!req.file) {
        return res.status(400).json({ msg: 'No file uploaded' })
    }

    // const uploadedFilePath = req.file.path;
    // const newFilename = req.body.name + path.extname(req.file.originalname);
    // const newFilePath = path.join(path.dirname(uploadedFilePath), newFilename);

    const uploadedFilePath = req.file.path;
    const originalFilename = req.body.name + path.extname(req.file.originalname);
    const newFilename = await getUniqueFilename(originalFilename);
    const newFilePath = path.join(path.dirname(uploadedFilePath), newFilename);

    try {
        await fs.promises.rename(uploadedFilePath, newFilePath); 

        console.log('File renamed:', newFilePath);

        res.json({ msg: 'File uploaded and renamed successfully.', file: newFilename });
    } catch (error) {
        console.error('Error renaming file:', error);
        res.status(500).json({ msg: 'Error renaming file.' });
    }

}) 

async function getUniqueFilename(originalFilename) {
    const uploadPath = path.join(__dirname, '../client/src/assets');
    let newFilename = originalFilename;

    let count = 1;
    while (fs.existsSync(path.join(uploadPath, newFilename))) {
        const ext = path.extname(originalFilename);
        const baseName = path.basename(originalFilename, ext);
        newFilename = `${baseName} (${count})${ext}`;
        count++;
    }

    return newFilename;   
}
 
module.exports = router  