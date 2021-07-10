const AWS = require('aws-sdk');
require('dotenv').config()

const   region = "us-east-2",
        bucketName = "mond-direct-upload-bucket",
        accessKeyId = process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

        
const s3 = new AWS.S3({
    region,
    accessKeyId,
    secretAccessKey,
    signatureVersion: 'v4'
})


//  async function generateUploadURL(){
module.exports = async function (){

    const imageName = "random image Name"


    const params = ({
        Bucket: bucketName,
        Key: imageName,
        Expires: 60 // url valid for 60 secs
    })

    const uploadURL = await s3.getSignedUrlPromise('putObject', params)

    return uploadURL
}



