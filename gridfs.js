const { MongoClient, GridFSBucket } = require('mongodb');
const fs = require('fs');
const path = require('path')

const uri = "mongodb+srv://expansion4you:xH7Rd6ji1Ya413xm@cluster0.kgapqpo.mongodb.net/" 
const dbName = 'test'; 
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


//=================
// async function uploadFile(fileBuffer, filename) {
//     const bucket = new GridFSBucket(client.db(dbName));
  
//     const uploadStream = bucket.openUploadStream(filename);
//     uploadStream.end(fileBuffer); 


  
//     return new Promise((resolve, reject) => {
//       uploadStream.on('finish', resolve);
//       uploadStream.on('error', reject);
//     });
// }

async function uploadFile(fileBuffer, filename) {
    const bucket = new GridFSBucket(client.db(dbName));

    let uploadStream;
    let newFilename = filename
    
    const existingFile = await bucket.find({ filename }).toArray();
    if (existingFile.length > 0) {
        let counter = 1;
        let baseFilename = filename.replace(/\.\w+$/, '');
        let extname = path.extname(filename);
        
        while (existingFile.some(f => f.filename === `${baseFilename} (${counter})${extname}`)) {
            counter++;
        }
        
        newFilename = `${baseFilename} (${counter})${extname}`;
        uploadStream = bucket.openUploadStream(newFilename);
    } else {
        uploadStream = bucket.openUploadStream(filename);
    }

    uploadStream.end(fileBuffer); 

    return new Promise((resolve, reject) => {
        uploadStream.on('finish', () => resolve(newFilename));
        uploadStream.on('error', reject);
    });
}

async function downloadFile(filename) {
    const bucket = new GridFSBucket(client.db(dbName));
    const downloadStream = bucket.openDownloadStreamByName(filename);
    
    return new Promise((resolve, reject) => {
        const chunks = [];
        downloadStream.on('data', chunk => chunks.push(chunk));
        downloadStream.on('error', reject);
        downloadStream.on('end', () => resolve(Buffer.concat(chunks)));
    });
}

async function deleteFile(filename) {
    const bucket = new GridFSBucket(client.db(dbName));
    const file = await bucket.find({ filename }).toArray();
    if (file.length === 0) {
        throw new Error(`File not found for filename: ${filename}`);
    }

    const fileId = file[0]._id;
    await bucket.delete(fileId);
}


module.exports = {
  uploadFile,
  downloadFile,
  deleteFile
};
