import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";
import config from "../config/config.js"


async function sendTokenResponse(user,res)
{
    const token=jwt.sign({
        id:user._id
    },config.JWT_SECRET,{expiresIn:"1d"})
}

async function RegisterController(req,res) {

    const {email,password,fullname,contact,role}=req.body

    try{
        const isUserExist= await UserModel.findOne({
            $or:[
                {email},
                {contact}
            ]
        })

        if(isUserExist)
        {
            return res.status(400).json({
                message:"user Already Exist"
            })
        }

        const user=await UserModel.create({
            email,fullname,password,contact
        })



    }
    catch(error)
    {
        console.log(error)
        return res.status(500).json({
            message:"Server error"
        })
    }


}