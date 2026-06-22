import { Router } from "express";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { validateAddtoCart } from "../validator/cart.validator.js";
import { addtoCart, getcart } from "../controller/cart.controller.js";

const cartRouter=Router()



cartRouter.post("/add/:productId/:variantId",authenticateUser,validateAddtoCart,addtoCart)

cartRouter.get("/",authenticateUser,getcart)


export default cartRouter