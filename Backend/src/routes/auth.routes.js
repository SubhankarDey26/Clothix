import { Router } from "express";
import { validateRegisterUser, validateLoginUser, handleValidationErrors } from "../validator/auth.validator.js";
import {RegisterController, LoginController} from "../controller/auth.controller.js"

const authrouter=Router()

// POST /api/auth/register - Register a new user with validation
authrouter.post("/register", validateRegisterUser, handleValidationErrors, RegisterController)

// POST /api/auth/login - Login user with email and password
authrouter.post("/login",validateLoginUser,handleValidationErrors,LoginController)

export default authrouter