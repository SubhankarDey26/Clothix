import { Router } from "express";
import { authenticateSeller } from "../middleware/auth.middleware.js";
import { createProduct, getSeller, ShowAllProducts } from "../controller/product.controller.js";
import { validateCreateProduct } from "../validator/product.validator.js";
import multer from "multer"



const productRouter=Router()


const upload=multer({
    storage:multer.memoryStorage(),
    limits:{
        fileSize:5*1024*1024
    }
})

productRouter.post("/",authenticateSeller,upload.any(),validateCreateProduct,createProduct)

productRouter.get("/seller",authenticateSeller,getSeller)

productRouter.get("/",ShowAllProducts)




export default productRouter