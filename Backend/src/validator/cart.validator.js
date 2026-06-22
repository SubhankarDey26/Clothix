import {param,body,validationResult} from "express-validator"


const validateRequest=(req,res,next)=>{
    const error=validationResult(req);
    if(!error.isEmpty())
    {
        return res.status(400).json({
            error:error.array()
        })
    }
    next();
}



export const validateAddtoCart=[
    param("productId").isMongoId().withMessage("Invalid product Id"),
    param("variantId").optional().isMongoId().withMessage("Invalid Variant Id"),
    body("quantity").optional().isInt({min:1}).withMessage("Quantity must be atleast 1"),
    validateRequest
]