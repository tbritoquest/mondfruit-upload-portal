

const  express = require('express')
const  app =  express()
const  generateUploadURL = require('./s3')
const cookieParser = require('cookie-parser')
const  port = process.env.PORT || 3000


//Cookie Parser
app.use(cookieParser('This is my secret'))


// Body Parser Middleware
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use(express.static('public'))


const db = new Set([
    "2019144129",
    "2016532226",
    "7185520712"
])


function restrict(req, res, next){
    if(req.signedCookies.user){
        next()
    }else{
        res.redirect('/')
    }
}



app.get('/', (req,res)=>{

    if(req.signedCookies.user){
        res.redirect('/dashboard')
    }
})

app.post('/login',function (req, res) { // create a cookie and redirect to dash board where form will be for now

    let minute = 60000

   // Authenticate phone number
    if(db.has(req.body["phoneNum"])){
        if(req.body.phoneNum) res.cookie('user', req.body.phoneNum, {maxAge:minute, signed: true})
        res.redirect('/dashboard')
    }else{
        res.send("Unauthorized.")
    }
    
})

app.get('/dashboard', restrict, (req,res)=>{
   res.send("dashboard")
})



// app.get('/', (req, res)=>{
//     res.send('Hello world')
// })





// app.get('/s3Url', async (req,res)=>{

   
//     const url = await generateUploadURL()
//     res.send({url})

//     res.send("Unauthorized.")
    
    
    
    
// })



app.listen(port, ()=>{
    console.log(`example app listening at http://localhost:${port}`)
})
