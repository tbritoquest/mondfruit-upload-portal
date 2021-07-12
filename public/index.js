const loginForm = document.getElementById('loginForm')

let upload
try{
    upload = new FileUploadWithPreview('myUniqueUploadId') 
}catch(e){
    upload = null
}

if(loginForm){
    loginForm.addEventListener('submit', async event =>{
        event.preventDefault()
        const data = { phoneNum: document.getElementById('phone').value };
    
        const {message} = await fetch('/login', {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        }).then(res=> res.json())
    
        if(message === "Authorized"){
            window.location.href = '/dashboard';
        }else{
            document.getElementById("phone").classList.add("is-danger")
            document.getElementById("phone-error").classList.add("is-danger")
            console.log(message)
        }

       
    
    })
}


if(upload){
    const uploadForm = document.getElementById('uploadForm')

    uploadForm.addEventListener('submit', event =>{
        event.preventDefault()
        // console.log("Upload form submitted! ", upload.cachedFileArray)
        const formData = new FormData()
        const images = upload.cachedFileArray

        formData.append('title', 'Proof of Delivery')
        
        for (let i = 0; i < images.length; i++) {
            formData.append('images', images[i]);
        }

        showInProgress()

        fetch('/images', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(result => {
            console.log('Success:', result);
            if(result.message === "Upload Completed"){
                upload.clearPreviewPanel()
            }
            hideInProgress()
        })
        .catch(error => {
            console.error('Error:', error);
            hideInProgress()
        });
    })
}



function showInProgress(){
    document.getElementById("in-progress").classList.remove("hide")
}

function hideInProgress(){
    document.getElementById("in-progress").classList.add("hide")
}