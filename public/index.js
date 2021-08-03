const loginForm = document.getElementById('loginForm')

let upload
try{
    upload = document.getElementById("files")
}catch(e){
    upload = null
}

if(loginForm){
    loginForm.addEventListener('submit', async event =>{

        event.preventDefault()

        let phoneNum = formattedPhoneNumber(document.getElementById('phone').value)
        
        if(!isPhoneValid(phoneNum)){
            phoneError("Invalid number.")
            return
        }

        const data = { phoneNum };
    
        const {message} = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        }).then(res=> res.json())
    
        if(message === "Authorized"){
            window.location.href = '/routes';
        }else{
            phoneError("This number is unauthorized.")
        }

       
    
    })
}

function isPhoneValid(str){
    return str.length === 12
}

function phoneError(msg){
    
    document.getElementById("phone").classList.add("is-danger")
    let phoneError = document.getElementById("phone-error")
    phoneError.classList.add("is-danger")
    phoneError.innerHTML = msg
}

if(upload){
    const uploadForm = document.getElementById('uploadForm')
    
    uploadForm.addEventListener('submit', async event =>{
        event.preventDefault()
        const routePositionsId = document.getElementById('routePositionsId').value
        showInProgress()

        let files = document.getElementById("files").files

        let filesUnsent= files.length
        let currIndex = 0

        let progressIncrement = parseInt(100/filesUnsent)
        let progress = 0

        let totalFiles = filesUnsent

        while(totalFiles > 0){
           
            try{
                
                let formData = new FormData()
                formData.append('images', files[currIndex])
                formData.append('routePositionsId', routePositionsId)

                let {message} = await fetch('/images', {
            
                    method: 'POST',
                    body: formData,
                }).then(response => response.json())
                .catch((e)=>{
                    if(document.cookie.length === 0){
                        showOverlay()
                        showNotification('error', "Your session has ended. Please <a href='/'>log in</a>.")
                        hideInProgress()
                        return
                    }
                    
                })
                
                if(message === "Upload Completed"){
                    // upload.deleteFileAtIndex(currIndex)
                    totalFiles--
                }else{
                    currIndex++//skip file that was unsuccessful
                }

            }catch(error){
                
                if(document.cookie.length == 0){
                    showOverlay()
                    showNotification('error', "Your session has ended. Please <a href='/'>log in</a>.")
                    hideInProgress()
                    return
                }
                else
                    currIndex++ //skip file that was unsuccessful
                    totalFiles--
            }

            progress+=progressIncrement
            document.getElementsByClassName('progress-bar-fill')[0].style=`width: ${progress}%;`
            filesUnsent--
        }

        hideInProgress()

        // Check if files uploaded successfully
        if(totalFiles.length){
            showNotification('error', `${upload.cachedFileArray.length} ${upload.cachedFileArray.length===1? "file":"files"} failed to upload. Please try again.`)
        }else{
            window.location.href="/success"
        }
        
    })


    window.addEventListener("fileUploadWithPreview:imagesAdded", toggleSubmit);

    window.addEventListener("fileUploadWithPreview:imageDeleted", toggleSubmit);
}

function toggleSubmit(){
    // let submitBtn = document.querySelector("#uploadForm button[type='submit']")
    // submitBtn.disabled = upload.cachedFileArray.length > 0 ? false: true
    
}

const alertTypes = {
    success:"is-success is-light",
    error : "is-danger is-light"
}

function showNotification(status, message){
    let el = document.querySelector("div.notification")
    el.className = `notification ${alertTypes[status]}`
    el.querySelector('p').innerHTML = message
    
}

function showInProgress(){
    document.getElementById("in-progress").classList.remove("hide")
}

function showOverlay(){
    document.querySelector('.overlay').classList.remove("hide")
}

function hideInProgress(){
    document.getElementById("in-progress").classList.add("hide")
    document.getElementsByClassName('progress-bar-fill')[0].style='width:0;'
}


function formattedPhoneNumber(str){
    let str2 = str.split('').filter(char => char.match(/^\d$/))
    let arr = []
    arr.push(str2.slice(0,3).join(''))
    arr.push(str2.slice(3,6).join(''))
    arr.push(str2.slice(6).join(''))
    return arr.join('-')
}



