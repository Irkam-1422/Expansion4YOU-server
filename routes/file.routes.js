const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const { uploadFile, downloadFile, deleteFile } = require('../gridfs');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// router.get('/get/:filename', async (req, res) => { 
//     const filename = req.params.filename.slice(1);
//     console.log(filename)
//     try {
//         await downloadFile(filename, res);
//     } catch (error) {
//         console.error('An error occurred:', error);
//         res.status(500).json({ msg: 'Server error' });
//     }
// });
router.get('/get/:filename', async (req, res) => {
    const filename = req.params.filename 
    console.log(filename)
    try {
        const fileBuffer = await downloadFile(filename);
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(fileBuffer);
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ msg: 'Server error' });
    }
});

router.post('/upload', upload.single('file'), async (req, res) => { 
    try {
        const file = req.file
        const originalFileName = req.body.name;

        if (!req.file) res.status(400).json({ msg: 'No file has been uploaded' });
        if (!req.body) res.status(400).json({ msg: 'Req body is empty' });

        const newFileName = await uploadFile(file.buffer, originalFileName);
 
        const fileUrl = `/api/file/get/:${newFileName}`;
        res.json({ msg: 'File uploaded and saved', filename: newFileName, fileUrl });
    } catch (error) {
        console.error('An error occurred:', error); 
        res.status(500).json({ msg: 'Server error' });
    }
});

router.post('/replace-file', upload.single('file'), async (req, res) => {
    const existingFileName = req.body.name; 
    const newFileBuffer = req.file.buffer; 

    if (!req.file) res.status(400).json({ msg: 'No file has been uploaded' });
    if (!req.body) res.status(400).json({ msg: 'Req body is empty' });

    try {
        await deleteFile(existingFileName); 
        await uploadFile(newFileBuffer, existingFileName);

        res.json({ msg: 'File replaced and renamed successfully.' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
