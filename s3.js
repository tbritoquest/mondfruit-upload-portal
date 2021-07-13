require('dotenv').config()
const AWS = require('aws-sdk')
const fs = require('fs')


const   region = "us-east-2",
        bucketName = "mond-direct-upload-bucket",
        accessKeyId = process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

        
const s3 = new AWS.S3({
    region,
    accessKeyId,
    secretAccessKey
})

//uploads a file to s3
function uploadFile(file,deliveryStop){
    console.log("S3: ",s3)
    const fileStream = fs.createReadStream(file.path)

    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: `${deliveryStop}/${file.filename}`
    }

    return s3.upload(uploadParams).promise()
}

//downloads a file from s3
function getFileStream(fileKey){
    const downloadParams = {
        Key: fileKey,
        Bucket: bucketName
    }

    return s3.getObject(downloadParams).createReadStream()
}

module.exports = {uploadFile, getFileStream}


