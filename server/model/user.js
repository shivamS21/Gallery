const mongoose=require('mongoose')

const UserSchema=new mongoose.Schema({
    userId:{type:String,required:true},
    imgId:{type:String},
    img: 
      {   name: String,
          data: Buffer 
     }
})

const model=mongoose.model("UserModel",UserSchema)

module.exports=model