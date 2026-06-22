import cartModel from "../models/cart.model.js";
import ProductModel from "../models/product.model.js";

export const addtoCart = async (req, res) => {
    try {
        const { productId, variantId } = req.params;
        const quantity = parseInt(req.body.quantity) || 1; // Default quantity to 1 if not provided

        // Find the product and the specific variant
        const product = await ProductModel.findOne({
            _id: productId,
            "variants._id": variantId
        });

        if (!product) {
            return res.status(404).json({
                message: "Product Variant not Found",
                success: false
            });
        }

        // Find the specific variant to access its stock and price
        const variant = product.variants.find(v => v._id.toString() === variantId);
        
        // Edge case: Variant not found within product
        if (!variant) {
            return res.status(404).json({
                message: "Variant not found in product",
                success: false
            });
        }

        const stock = variant.stock;

        // Fetch user's cart or create a new one
        let cart = await cartModel.findOne({ user: req.user._id });
        if (!cart) {
            cart = await cartModel.create({ user: req.user._id, items: [] });
        }

        // Check if product with this variant is already in the cart
        const existingCartItemIndex = cart.items.findIndex(
            item => item.product.toString() === productId && item.variant?.toString() === variantId
        );

        if (existingCartItemIndex > -1) {
            // Item exists in cart, check stock limits
            const existingQuantity = cart.items[existingCartItemIndex].quantity;
            const totalRequestedQuantity = existingQuantity + quantity;

            // Edge case: Requested quantity exceeds available stock
            // e.g. seller stock = 5, buyer already has 5 in cart, tries to add more
            if (totalRequestedQuantity > stock) {
                return res.status(400).json({
                    message: `Cannot add product. Seller stock is ${stock}. You already have ${existingQuantity} in your cart.`,
                    success: false
                });
            }

            // Update the quantity of the existing cart item
            cart.items[existingCartItemIndex].quantity = totalRequestedQuantity;
        } else {
            // Item does not exist in cart, check stock limit
            if (quantity > stock) {
                return res.status(400).json({
                    message: `Cannot add product. Requested quantity exceeds available seller stock of ${stock}.`,
                    success: false
                });
            }

            // Determine price: use variant price if available, else fallback to product price
            const priceToUse = variant.price?.amount ? variant.price : product.price;

            // Add the new item to the cart
            cart.items.push({
                product: productId,
                variant: variantId,
                quantity: quantity,
                price: priceToUse
            });
        }

        // Save the updated cart
        await cart.save();

        return res.status(200).json({
            message: "Product added to cart successfully",
            success: true,
            cart
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error while adding to cart",
            success: false,
            error: error.message
        });
    }
};


export const getcart=async (req,res)=>{
    const use=req.user

    let cart=await cartModel.findOne({user:user._id}).populate("items.product")

    if(!cart)
    {
        cart=await cartModel.create({user:user._id})
    }

    return res.status(200).json({
        message:"Cart fetched sucessfully",
        success:true,
        cart
    })
}