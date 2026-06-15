import {body,validationResult} from "express-validator"


// Middleware: Handle validation errors from express-validator
function validateRequest(req,res,next)
{
    const errors=validateRequest(req)

    if(!errors.isEmpty())
    {
        return res.status(400).json({
            message:"Validation Error"
        })
    }
}



// Validate product creation fields
export const validateCreateProduct=[
    body("title")
        .notEmpty().withMessage("Title is required")
        .isLength({min:3}).withMessage("Title must be at least 3 characters long")
        .isLength({max:150}).withMessage("Title must not exceed 150 characters")
        .trim(),
    body("description")
        .notEmpty().withMessage("Description is required")
        .isLength({min:10}).withMessage("Description must be at least 10 characters long")
        .isLength({max:2000}).withMessage("Description must not exceed 2000 characters")
        .trim(),
    body("priceAmount")
        .notEmpty().withMessage("Price amount is required")
        .isFloat({min:0.01}).withMessage("Price must be a positive number"),
    body("priceCurrency")
        .optional()
        .isIn(["USD","EUR","GBP","JPY","INR"]).withMessage("Currency must be one of: USD, EUR, GBP, JPY, INR"),

        validateRequest

]