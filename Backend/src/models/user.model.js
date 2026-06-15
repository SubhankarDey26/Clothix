import mongoose, { Mongoose } from "mongoose";
import bcrypt from "bcryptjs"

const UserSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    contact:{
        type:String,
        required:false
    },
    password:{
        type:String,
        required:function()
        {
            return !this.googleId
        }
    },
    fullname:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["buyer","seller"],
        default:"buyer"
    },
    googleId:{
        type:String,
        required:false
    }
})


UserSchema.pre("save",async function() {
    if(!this.isModified("password")) return 
    const hash=await bcrypt.hash(this.password,10)

    this.password=hash

})

UserSchema.methods.comparePassword=async function(password) {
    return await bcrypt.compare(password,this.password)
    
}

const UserModel=mongoose.model("user",UserSchema)

export default UserModel