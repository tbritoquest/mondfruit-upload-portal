const loginForm = document.getElementById('loginForm')

loginForm.addEventListener('submit', async event =>{
    event.preventDefault()
    
    // const data = {phoneNum: document.getElementById('phone').value}

    // const rawResponse = await fetch('/login', {
    //                                 method: 'POST',
    //                                 headers: {
    //                                 'Accept': 'application/json',
    //                                 'Content-Type': 'application/json'
    //                                 },
    //                                 body: JSON.stringify(data)
    //                                 });


    // Get secure url from our server
    const {url} = await fetch("/s3Url").then(res=> res.json())

    console.log(url); return;
    const file = upload.cachedFileArray[0]
    //post image directly to the s3 bucket
    await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "multipart/formdata"
        },
        body: file
    })
    
    const imageUrl = url.split('?')[0]
    console.log(imageUrl)


    const img = document.createElement("img")
    img.src = imageUrl
    document.body.appendChild(img)
})

let upload = new FileUploadWithPreview('myUniqueUploadId')