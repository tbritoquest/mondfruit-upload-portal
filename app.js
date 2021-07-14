

const  express = require('express')
var expressLayouts = require('express-ejs-layouts')
const  app =  express()
// const  generateUploadURL = require('./s3')
const s3 = require('./s3')
const cookieParser = require('cookie-parser')
const  port = process.env.PORT || 3000
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })


// Set the template engine
app.set('view engine', 'ejs')
app.use(expressLayouts)

//Cookie Parser
app.use(cookieParser('This is my secret'))


// Body Parser Middleware
app.use(express.json())
app.use(express.urlencoded({extended: false}))

// More middleware
function restrict(req, res, next){
    
    if(req.signedCookies.user){
        console.log("verified")
        next()
    }else{
        console.log("not verified")
        res.redirect('/')
    }
}

//static files
app.use(express.static('public'))

// Database
const employees = require('./db/employees.js')

const data = require('./db/db.js')


app.get('/success',restrict,(req,res)=>{
    res.render('success',{layout: 'basicLayout',title:'successPage'})
})

app.get('/', (req,res,next)=>{
    if(req.signedCookies.user){
        res.redirect('/routes')
    }else{
        res.render('loginForm', {title:'Login'})
        
    }
  
})


app.post('/login',function (req, res) { // create a cookie and redirect to dash board where form will be for now

    let minute = 60000
    
   // Authenticate phone number
    if(employees.has(req.body["phoneNum"])){
        if(req.body.phoneNum) res.cookie('user', req.body.phoneNum, {maxAge:minute, signed: true})
        res.status(200).send({message: "Authorized"})
    }else{
        res.status(500).send({message: "Unauthorized"})
    }
    
})

app.get('/routes',restrict,(req,res)=>{
    res.render('routes',{title: 'Delivery Stops', deliveryStops: data.get("2019144129")})
})
app.get('/routes/:id', restrict, (req, res)=> {
    let id = req.params.id
    res.render('uploadForm',{title:'Uploads', deliveryId: id})
  })


// app.get('/dashboard', restrict,(req,res)=>{
//     res.render('uploadForm',{title:"Dashboard"})
// })

app.post('/images', restrict, upload.array('images', 30), async (req,res)=>{
  
    for(let i=0;i<req.files.length;i++){
        let result = await s3.uploadFile(req.files[i], req.body.deliveryId)
        console.log(`Result ${i}: `,result)
    }
    
    res.send({message: "Upload Completed"})
})

//testing
app.get('/images/:key', (req,res)=>{
    let key = req.params.key
    // console.log("key: ", req.params)
    const readStream = s3.getFileStream(key)

    readStream.pipe(res)
})


app.listen(port, ()=>{
    console.log(`example app listening at http://localhost:${port}`)
})


