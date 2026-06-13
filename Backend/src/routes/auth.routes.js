import { Router } from "express";
import { validateRegisterUser, validateLoginUser, handleValidationErrors } from "../validator/auth.validator.js";
import {RegisterController} from "../controller/auth.controller.js"

// TODO: Import LoginController when implemented
// import {LoginController} from "../controller/auth.controller.js"

const authrouter=Router()

// POST /api/auth/register - Register a new user with validation
authrouter.post("/register", validateRegisterUser, handleValidationErrors, RegisterController)

// TODO: POST /api/auth/login - Login user with email and password
// authrouter.post("/login", validateLoginUser, handleValidationErrors, LoginController)

export default authrouter