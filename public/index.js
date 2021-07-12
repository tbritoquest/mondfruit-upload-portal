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

    uploadForm.addEventListener('submit', async event =>{
        event.preventDefault()
       
        showInProgress()

        let filesUnsent= upload.cachedFileArray.length
        let currIndex = 0

        let progressIncrement = parseInt(100/filesUnsent)
        let progress = 0
        while(upload.cachedFileArray.length>0 && filesUnsent > 0){

            try{
                
                let formData = new FormData()
                formData.append('images', upload.cachedFileArray[currIndex])
    
                let {message} = await fetch('/images', {
                    method: 'POST',
                    body: formData,
                })
                .then(response => response.json())

                if(message === "Upload Completed"){
                    console.log("Completed: ",upload.cachedFileArray[currIndex])
                    upload.deleteFileAtIndex(currIndex)
                }else{
                    currIndex++//skip file that was unsuccessful
                }

            }catch(error){
                console.log(error)
                currIndex++ //skip file that was unsuccessful
            }

            progress+=progressIncrement
            document.getElementsByClassName('progress-bar-fill')[0].style=`width: ${progress}%;`
            filesUnsent--
        }

        hideInProgress()
        if(upload.cachedFileArray.length){
            shownNotification('error', `${upload.cachedFileArray.length} files failed to upload. Please try again.`)
        }else{
            shownNotification('success', `Upload successful.`)
        }
        
    })
}

// function showSuccessNotification(message){
//     let el = document.querySelector("div.notification")
//     el.style.display = "block"
//     el.className = "notification is-primary is-light"
//     el.innerHTML = message
// }

// function showErrorNotification(message){
//     let el = document.querySelector("div.notification")
//     el.style.display = "block"
//     el.className = "notification is-danger is-light"
//     el.innerHTML = message
// }

const alertTypes = {
    success:"is-success is-light",
    error : "is-danger is-light"
}

function shownNotification(status, message){
    let el = document.querySelector("div.notification")
    el.style.display = "block"
    el.className = `notification ${alertTypes[status]}`
    // el.document.querySelector('p').innerHtml = message
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
        $notification.style.display = "none"
      });
    });
  });