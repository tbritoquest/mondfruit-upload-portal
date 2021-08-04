const loginForm = document.getElementById('loginForm')

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
    
        if(message !== "Unauthorized"){
            localStorage.setItem('username', message);
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

function logout(){
    console.log(document.cookie)
    document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;'

    window.location.href = "/"
}
