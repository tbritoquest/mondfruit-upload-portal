

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


const db = new Set([
    "2019144129",
    "2016532226",
    "7185520712"
])



app.get('/', (req,res)=>{
    if(req.signedCookies.user){
        res.redirect('/dashboard')
    }else{
        res.render('loginForm', {title:'Login'})
    }

})


app.post('/login',function (req, res) { // create a cookie and redirect to dash board where form will be for now

    let minute = 60000

   // Authenticate phone number
    if(db.has(req.body["phoneNum"])){
        if(req.body.phoneNum) res.cookie('user', req.body.phoneNum, {maxAge:minute, signed: true})
        res.send(200,{message:"Authorized"})
    }else{
        res.send(500,{message: "Unauthorized."})
    }
    
})

app.get('/dashboard', restrict,(req,res)=>{
    res.render('uploadForm',{title:"Dashboard"})
})

app.post('/images', upload.array('images', 12), async (req,res)=>{
    console.log("Files: ", req.files)
    for(let i=0;i<req.files.length;i++){
        let result = await s3.uploadFile(req.files[i])
        console.log(`Result ${i}: `,result)
    }
    
    res.send("upload completed")
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


