import {body,validationResult} from "express-validator"

export const validateRegisterUser=[
    body("email")
        .isEmail().withMessage("Invalid email Format"),
    body("contact")
        .notEmpty().withMessage("Contact is required")
        .isMobilePhone().withMessage("Contact must be a valid phone number"),
    body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({min:6}).withMessage("Password must be at least 6 characters long"),
    body("fullname")
        .notEmpty().withMessage("Full name is required")
        .isLength({min:2}).withMessage("Full name must be at least 2 characters long"),
    // body("role")
    //     .optional()
    //     .isIn(["buyer","seller"]).withMessage("Role must be either buyer or seller")

    handleValidationErrors
]





// export const validateLoginUser=[
//     body("email")
//         .isEmail().withMessage("Invalid email Format"),
//     body("password")
//         .notEmpty().withMessage("Password is required")
// ]

export const handleValidationErrors=(req,res,next)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    next()
}