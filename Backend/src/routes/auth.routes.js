import { Router } from "express";
import { validateRegisterUser, validateLoginUser, handleValidationErrors } from "../validator/auth.validator.js";
import {RegisterController, LoginController, googleCallback} from "../controller/auth.controller.js"
import passport from "passport";

const authrouter=Router()

// POST /api/auth/register - Register a new user with validation
authrouter.post("/register", validateRegisterUser, handleValidationErrors, RegisterController)

// POST /api/auth/login - Login user with email and password
authrouter.post("/login",validateLoginUser,handleValidationErrors,LoginController)


// Route to initiate Google OAuth flow
authrouter.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);


// Callback route that Google will redirect to after authentication
authrouter.get('/google/callback',
  passport.authenticate('google', { session: false }),
  googleCallback
);

export default authrouter