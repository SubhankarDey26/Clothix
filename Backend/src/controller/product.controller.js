import ProductModel from "../models/product.model.js"
import { uploadFile } from "../services/storage.service.js"

export async function createProduct(req,res) {
    const {title,description,priceAmount,priceCurrency}=req.body
    const seller=req.user
    // With upload.any(), files are directly in req.files array
    const images=await Promise.all(req.files.map(async(file)=>{
        const result = await uploadFile({
            buffer:file.buffer,
            fileName:file.originalname
        })
        return { url: result.url }
    }))

    const product=await ProductModel.create({
        title,
        description,
        price:{
            amount:priceAmount,
            currency:priceCurrency || "INR"
        },
        image:images,
        seller:seller._id
    })

    res.status(201).json({
        message:"Product created Sucessfully",
        success:true,
        product
    })
}

export async function getSeller(req,res) {
    const seller=req.user
    const products=await ProductModel.find({
        seller:seller._id
    })

    res.status(200).json({
        message:"Product fetched Sucessfully",
        success:true,
        products
    })
}


export async function ShowAllProducts(req,res){
    const products=await ProductModel.find()
    return res.status(200).json({
        message:"Products fetched Sucessfully",
        sucess:true,
        products
    })
}



export async function getProductDetails(req,res){
    const {id}=req.params
    const product=await ProductModel.findById(id)

    if(!product)
    {
        return res.status(404).json({
            message:"Product Not Found",
            sucess:false
        })
    }

    return res.status(200).json({
        message:"Product Details fetched Sucessfully",
        success:true,
        product
    })
}