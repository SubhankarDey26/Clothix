import { Router } from "express";
import { validateRegisterUser } from "../validator/auth.validator.js";

const authrouter=Router()


authrouter.post("/register",validateRegisterUser,)
authrouter.post("/login")


export default authrouter