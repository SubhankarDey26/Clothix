import { Router } from "express";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { validateAddtoCart } from "../validator/cart.validator.js";
import { addtoCart, getcart, updateCartItemQuantity, removeFromCart } from "../controller/cart.controller.js";

const cartRouter=Router()



cartRouter.post("/add/:productId/:variantId",authenticateUser,validateAddtoCart,addtoCart)
cartRouter.put("/update/:productId/:variantId",authenticateUser,updateCartItemQuantity)
cartRouter.delete("/remove/:productId/:variantId",authenticateUser,removeFromCart)

cartRouter.get("/",authenticateUser,getcart)


export default cartRouter