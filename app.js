const  express = require('express')
var expressLayouts = require('express-ejs-layouts')
const  app =  express()
const s3 = require('./s3')
const cookieParser = require('cookie-parser')
const  port = process.env.PORT || 3000
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
const fetch = require('node-fetch')
require('dotenv').config()

// Set the template engine
app.set('view engine', 'ejs')
app.use(expressLayouts)

//Cookie Parser
app.use(cookieParser(process.env.COOKIE_SECRET))


// Body Parser Middleware
app.use(express.json())
app.use(express.urlencoded({extended: false}))

// More middleware
function restrict(req, res, next){
    if(req.signedCookies.user){
        next()
    }else{
        res.redirect('/')
    }
}

//static files
app.use(express.static('public'))

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


app.post('/login',async function (req, res) { 
    
    let result = await fetch(`https://mondfruitapp.com/api/drivers/phone/${req.body.phoneNum}`)
        .then(response => response.json())

    let hour = 60000 * 60
    
    if(result.length>0){
        res.cookie('user', result[0].id, {maxAge:hour*12, signed: true,path:'/'})
        res.status(200).send({message: `${result[0].firstName} ${result[0].lastName}`})
    }else{
        res.status(500).send({message: "Unauthorized"})
    }
    
})




app.get('/routes',restrict,async (req,res)=>{
    let date = new Date().toJSON().slice(0,10).replace(/-/g,'-')
    let result = await fetch(`https://mondfruitapp.com/api/drivers/id/${req.signedCookies.user}/deliveries/${date}`)
        .then(response => response.json())

    let unlockedStops = result.filter(stop=>!stop.isLocked)
    res.render('routes',{title: 'Delivery Stops', deliveryStops: unlockedStops})
})

app.get('/routes/:id', restrict, (req, res)=> {
    let id = req.params.id
    res.render('uploadForm',{title:'Uploads', routePositionsId: id})
})


app.post('/images/:id', restrict, upload.array('images', 100), async (req,res)=>{

    for(let i=0;i<req.files.length;i++){
        let result = await s3.uploadFile(req.files[i], req.params.id)
    }
    
    res.send({message: "Upload Completed"})
})


app.listen(port, ()=>{
    console.log(`Mondfruit Upload app listening at http://localhost:${port}`)
})


