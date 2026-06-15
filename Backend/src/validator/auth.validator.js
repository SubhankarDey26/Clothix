import {body,validationResult} from "express-validator"

// TODO: Add password hashing validation and encryption before storing in DB
export const validateRegisterUser=[
    body("email")
        .isEmail().withMessage("Invalid email Format"),
    body("contact")
        .notEmpty().withMessage("Contact is required")
        .isLength({min:10, max:15}).withMessage("Contact must be 10-15 digits"),
    body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({min:6}).withMessage("Password must be at least 6 characters long"),
    body("fullname")
        .notEmpty().withMessage("Full name is required")
        .isLength({min:2}).withMessage("Full name must be at least 2 characters long"),
    body("role")
        .optional()
        .isIn(["buyer","seller"]).withMessage("Role must be either buyer or seller")
]

// TODO: Implement login functionality with password comparison
export const validateLoginUser=[
    body("email")
        .isEmail().withMessage("Invalid email Format"),
    body("password")
        .notEmpty().withMessage("Password is required")
]

// Middleware: Handle validation errors from express-validator
export const handleValidationErrors=(req,res,next)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    next()
}