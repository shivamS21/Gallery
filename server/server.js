const express=require('express')
const port = process.env.PORT || 8000
const compression=require('compression')
const path=require('path');
const { v4: uuidv4 } = require('uuid');
var cors = require("cors");
const multer=require('multer')
const upload=multer({storage: multer.memoryStorage()})
require('dotenv').config()

const app = express()
app.use(cors());
app.use(express.urlencoded())
app.use(express.json());
// view engine setup
app.set('views', path.join(__dirname, 'static', 'views'))
app.set('view engine', 'ejs')
app.use(compression())
app.use('/public', express.static(path.join(__dirname, 'static', 'public')))
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
var fs = require('fs');
const mongoose = require('mongoose')
const User=require('./model/user')
const url = `mongodb+srv://bhavyta1234:bhavyta1234@cluster0.vomu6.mongodb.net/CONUNDRUM?retryWrites=true&w=majority`;
const connectionParams={
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true 
}
mongoose.connect(url,connectionParams)
    .then( () => {
        console.log('Connected to database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. \n${err}`);
    })



const download=require('download')
app.get('/',(req,res)=>{
    res.send({"hellp":"he;;"})
})
app.get('/download',async (req,res)=>{
    // await download('https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1200px-Image_created_with_a_mobile_phone.png', 'dist');
    var imgId = req.body.imgId;  
    // const response=await User.find({"imgId":imgId })
    const response=await User.find()
    console.log(response.length)
    if(response.length==0) res.send("Wrong id").status(400)
    else {
        console.log(response[0].img)
        const json={"name":response[0].img.data,"type":response[0].img.name}
    // res.download('https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1200px-Image_created_with_a_mobile_phone.png')
    res.send(json)
}
})
// var data=new Buffer(req.file.buffer, 'base64')  //convert buffer to image 
// fs.writeFileSync("programming.png", data);
app.post('/upload',upload.single('file'),async(req,res)=>{
//    console.log(req)
    let img_id=uuidv4();
    const response=await User.create({"userId":req.body.userId,imgId:img_id,img:{
    name:req.file.originalname,
    data:req.file.buffer, 
    }})
    res.send({"imgId":img_id});
    })


app.listen(port, (req,res)=>{
console.info(`Running on ${port}`)
})