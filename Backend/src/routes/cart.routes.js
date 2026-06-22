import { Router } from "express";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { validateAddtoCart } from "../validator/cart.validator.js";
import { addtoCart } from "../controller/cart.controller.js";

const cartRouter=Router()



cartRouter.post("/add/:productId/:variantId",authenticateUser,validateAddtoCart,addtoCart)




export default cartRouter