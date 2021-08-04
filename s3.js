require('dotenv').config()
const AWS = require('aws-sdk')
const fs = require('fs')
const sharp = require('sharp')


let development = true

const   region = "us-east-2",
        bucketName = development? "mond-direct-upload-bucket-dev": "mond-direct-upload-bucket",
        accessKeyId = process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY,
        endpoint = new AWS.Endpoint('s3-accelerate.amazonaws.com')


const s3 = new AWS.S3({
    region,
    accessKeyId,
    secretAccessKey,
    endpoint
})


// console.log(s3.endpoint)

//uploads a file to s3
function uploadFile(file,deliveryStop) {
    
    let resize = { fit: 'inside'}
    let d = new Date()
    let datestring = d.getFullYear() + "-" + ("0"+(d.getMonth()+1)).slice(-2)  + "-" + ("0" + d.getDate()).slice(-2)
    + "T"  +("0" + d.getHours()).slice(-2) + "-" + ("0" + d.getMinutes()).slice(-2)
    
    const image = sharp(file.path)
    const maxSideSize = 1000

    return image
        .metadata()
        .then(metadata => {
            if(metadata.width > metadata.height) {
                // horizontal
                resize.width = maxSideSize
            } else {
                // vertical
                resize.height = maxSideSize
            }

            let orientation = metadata.orientation

            return image
                // .rotate(rotate)
                .resize(resize)
                .withMetadata({orientation})
                .toFormat('jpeg')
                .jpeg({
                    quality: 70
                })
                .toBuffer()
                .then(buffer => {
                    // const fileStream = fs.createReadStream(file.path)

                    const fileType = file.mimetype
                    const fileExtension = fileType.slice(fileType.indexOf('/') + 1)

                    const uploadParams = {
                        Bucket: bucketName,
                        Body: buffer,
                        Key: `${deliveryStop}/mf-${deliveryStop}-${datestring}-${file.filename.slice(-10)}.${fileExtension}`,
                        ContentType: fileType,
                        ACL: 'public-read'
                    }

                    return s3.upload(uploadParams).promise()
                })
                .catch(err => {
                    console.log(err)
                })


        });
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


