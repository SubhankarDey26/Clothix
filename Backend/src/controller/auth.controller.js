import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";
import {config} from "../config/config.js"
// TODO: Import bcryptjs for password hashing - npm install bcryptjs
// import bcrypt from "bcryptjs";

// Helper: Generate JWT token and send response
async function sendTokenResponse(user,res,message)
{
    const token=jwt.sign({
        id:user._id
    },config.JWT_SECRET,
    {expiresIn:"7d"})

    // TODO: Set secure and httpOnly flags for production
    res.cookie("token",token)

    res.status(200).json({
        message,
        success:true,
        user:{
            id:user._id,
            email:user.email,
            contact:user.contact,
            fullname:user.fullname,
            role:user.role
        }
    })
}

// Controller: Handle user registration
export async function RegisterController(req,res) {

    const {email,password,fullname,contact,isSeller}=req.body

    try{
        // Check if user already exists with same email or contact
        const isUserExist= await UserModel.findOne({
            $or:[
                {email},
                {contact}
            ]
        })

        if(isUserExist)
        {
            return res.status(400).json({
                message:"User Already Exist"
            })
        }

        
        const user=await UserModel.create({
            email,
            fullname,
            password,
            contact,
            role: isSeller ? "seller":"buyer"  // Default role is buyer if not provided
        })

        await sendTokenResponse(user,res,"User Registered Successfully")


    }
    catch(error)
    {
        console.log(error)
        return res.status(500).json({
            message:"Server error"
        })
    }
}

