import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";
import {config} from "../config/config.js"

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

    const {email,password,fullname,contact,role}=req.body

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

        // Create user with plain password (will be hashed by pre-save hook)
        const user=await UserModel.create({
            email,
            fullname,
            password, // Password will be hashed by Mongoose pre-save hook
            contact,
            role: role || "buyer"  // Use role from request or default to buyer
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

// Controller: Handle user login
export async function LoginController(req,res) {

    const {email,password}=req.body

    try{
        // Find user by email
        const user=await UserModel.findOne({email})

        if(!user)
        {
            return res.status(400).json({
                message:"User not found"
            })
        }

        // Use bcrypt to compare passwords via method on user schema
        const isMatch=await user.comparePassword(password)

        if(!isMatch)
        {
            return res.status(400).json({
                message:"Invalid email or Password"
            })
        }

        await sendTokenResponse(user,res,"User Logged In Successfully")

    }
    catch(error)
    {
        console.log(error)
        return res.status(500).json({
            message:"Server error"
        })
    }
}
    
export const googleCallback=async(req,res)=>{

    // console.log(req.user)
    const {id,displayName,emails,photos}=req.user
    const email=emails[0].value
    const profilePic=photos[0].value
    let user =await UserModel.findOne({
        email
    })
    if(!user)
    {
       user= await UserModel.create({
        email,
        googleId:id,
        fullname:displayName,

       }) 
    }

    const token=jwt.sign({
        id:user._id
    },config.JWT_SECRET,{expiresIn:"7d"})

    res.cookie("token",token)
    
    res.redirect("http://localhost:5173/home")

}


export const getMe=async(req,res)=>{
    const user =req.user
    res.status(200).json({
        message:"User Fetched Sucessfully",
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

export const LogoutController=async(req,res)=>{
    res.clearCookie("token")
    res.status(200).json({
        message:"Logged out successfully",
        success:true
    })
}