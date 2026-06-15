import { Router } from "express";
import { authenticateSeller } from "../middleware/auth.middleware.js";
import { createProduct } from "../controller/product.controller.js";
import { validateCreateProduct } from "../validator/product.validator.js";
import multer from "multer"



const productRouter=Router()


const upload=multer({
    storage:multer.memoryStorage(),
    limits:{
        fileSize:5*1024*1024
    }
})

productRouter.post("/",authenticateSeller,validateCreateProduct,upload.array('images',7),createProduct)


export default productRouter