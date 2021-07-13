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
            window.location.href = '/routes';
        }else{
            document.getElementById("phone").classList.add("is-danger")
            document.getElementById("phone-error").classList.add("is-danger")
            
        }

       
    
    })
}


if(upload){
    const uploadForm = document.getElementById('uploadForm')
    
    uploadForm.addEventListener('submit', async event =>{
        event.preventDefault()
       

        const deliveryId = document.getElementById('deliveryId').value
        showInProgress()

        let filesUnsent= upload.cachedFileArray.length
        let currIndex = 0

        let progressIncrement = parseInt(100/filesUnsent)
        let progress = 0
        while(upload.cachedFileArray.length>0 && filesUnsent > 0){
           
            try{
                
                let formData = new FormData()
                formData.append('images', upload.cachedFileArray[currIndex])
                formData.append('deliveryId', deliveryId)
                
                let {message} = await fetch('/images', {
            
                    method: 'POST',
                    body: formData,
                }).then(response => response.json())
                .catch((e)=>{
                    if(document.cookie.length === 0){
                        showNotification('error', "Your session has ended. Please <a href='/'>log in</a>.")
                        hideInProgress()
                        return
                    }
                    // window.location.href = "/"
                    
                })
                
                if(message === "Upload Completed"){
                    upload.deleteFileAtIndex(currIndex)
                }else{
                    currIndex++//skip file that was unsuccessful
                }

            }catch(error){
                
                if(document.cookie.length == 0){
                    showNotification('error', "Your session has ended. Please <a href='/'>log in</a>.")
                    hideInProgress()
                    return
                }
                else
                    currIndex++ //skip file that was unsuccessful
            }

            progress+=progressIncrement
            document.getElementsByClassName('progress-bar-fill')[0].style=`width: ${progress}%;`
            filesUnsent--
        }

        hideInProgress()
        if(upload.cachedFileArray.length){
            showNotification('error', `${upload.cachedFileArray.length} ${upload.cachedFileArray.length===1? "file":"files"} failed to upload. Please try again.`)
        }else{
            showNotification('success', `Upload successful.`)
        }
        
    })


   

    // Submit button
    window.addEventListener("fileUploadWithPreview:imagesAdded", toggleSubmit);

    window.addEventListener("fileUploadWithPreview:imageDeleted", toggleSubmit);
}

function toggleSubmit(){
    let submitBtn = document.querySelector("#uploadForm button[type='submit']")
    submitBtn.disabled = upload.cachedFileArray.length > 0 ? false: true
    
}

const alertTypes = {
    success:"is-success is-light",
    error : "is-danger is-light"
}

function showNotification(status, message){
    let el = document.querySelector("div.notification")
    // el.style.display = "block"
    el.className = `notification ${alertTypes[status]}`
    el.children[1].innerHTML = message
    
}

function showInProgress(){
    document.getElementById("in-progress").classList.remove("hide")
    
}

function hideInProgress(){
    document.getElementById("in-progress").classList.add("hide")
    document.getElementsByClassName('progress-bar-fill')[0].style='width:0;'
}

/**
 * Bulma
 */

 document.addEventListener('DOMContentLoaded', () => {
    (document.querySelectorAll('.notification .delete') || []).forEach(($delete) => {
      const $notification = $delete.parentNode;
  
      $delete.addEventListener('click', () => {
        // $notification.parentNode.removeChild($notification);
        // $notification.style.display = "none"
        $notification.className = "notification hide"
      });
    });
  });