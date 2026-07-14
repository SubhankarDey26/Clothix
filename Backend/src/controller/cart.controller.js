import cartModel from "../models/cart.model.js";
import ProductModel from "../models/product.model.js";

const calculateCartTotal = async (userId) => {
    const aggregationResult = await cartModel.aggregate([
        { $match: { user: userId } },
        { $unwind: { path: '$items' } },
        {
            $lookup: {
                from: 'products',
                localField: 'items.product',
                foreignField: '_id',
                as: 'items.product'
            }
        },
        { $unwind: { path: '$items.product' } },
        { $unwind: { path: '$items.product.variants', preserveNullAndEmptyArrays: true } },
        {
            $match: {
                $expr: {
                    $or: [
                        { $eq: ['$items.variant', null] },
                        { $eq: ['$items.variant', '$items.product.variants._id'] }
                    ]
                }
            }
        },
        {
            $addFields: {
                itemPrice: {
                    $multiply: [
                        '$items.quantity',
                        { $ifNull: ['$items.product.variants.price.amount', '$items.product.price.amount'] }
                    ]
                }
            }
        },
        {
            $group: {
                _id: '$_id',
                totalPrice: { $sum: '$itemPrice' }
            }
        }
    ]);

    return aggregationResult.length > 0 ? aggregationResult[0].totalPrice : 0;
};

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
        await cart.populate("items.product");

        const cartTotal = await calculateCartTotal(req.user._id);

        return res.status(200).json({
            message: "Product added to cart successfully",
            success: true,
            cart,
            totalPrice: cartTotal
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error while adding to cart",
            success: false,
            error: error.message
        });
    }
};


export const getcart = async (req, res) => {
    try {
        const user = req.user;

        let cart = await cartModel.findOne({ user: user._id }).populate("items.product");

        if (!cart) {
            cart = await cartModel.create({ user: user._id });
            return res.status(200).json({
                message: "Cart fetched sucessfully",
                success: true,
                cart,
                totalPrice: 0
            });
        }

        const cartTotal = await calculateCartTotal(user._id);

        return res.status(200).json({
            message: "Cart fetched sucessfully",
            success: true,
            cart,
            totalPrice: cartTotal
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error while fetching cart",
            success: false,
            error: error.message
        });
    }
}

export const updateCartItemQuantity = async (req, res) => {
    try {
        const { productId, variantId } = req.params;
        const quantity = parseInt(req.body.quantity);

        if (isNaN(quantity) || quantity < 0) {
            return res.status(400).json({ message: "Invalid quantity provided", success: false });
        }

        const product = await ProductModel.findOne({ _id: productId, "variants._id": variantId });
        if (!product) return res.status(404).json({ message: "Product Variant not Found", success: false });

        const variant = product.variants.find(v => v._id.toString() === variantId);
        if (!variant) return res.status(404).json({ message: "Variant not found", success: false });

        const stock = variant.stock;

        let cart = await cartModel.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ message: "Cart not found", success: false });

        const existingCartItemIndex = cart.items.findIndex(
            item => item.product.toString() === productId && item.variant?.toString() === variantId
        );

        if (existingCartItemIndex === -1) {
            return res.status(404).json({ message: "Item not found in cart", success: false });
        }

        if (quantity === 0) {
            // Remove item completely
            cart.items.splice(existingCartItemIndex, 1);
        } else {
            if (quantity > stock) {
                return res.status(400).json({
                    message: `Requested quantity exceeds available stock of ${stock}.`,
                    success: false
                });
            }
            cart.items[existingCartItemIndex].quantity = quantity;
        }

        await cart.save();
        await cart.populate("items.product");

        const cartTotal = await calculateCartTotal(req.user._id);

        return res.status(200).json({
            message: "Cart updated successfully",
            success: true,
            cart,
            totalPrice: cartTotal
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error while updating cart",
            success: false,
            error: error.message
        });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const { productId, variantId } = req.params;

        let cart = await cartModel.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ message: "Cart not found", success: false });

        const existingCartItemIndex = cart.items.findIndex(
            item => item.product.toString() === productId && item.variant?.toString() === variantId
        );

        if (existingCartItemIndex === -1) {
            return res.status(404).json({ message: "Item not found in cart", success: false });
        }

        cart.items.splice(existingCartItemIndex, 1);
        
        await cart.save();
        await cart.populate("items.product");

        const cartTotal = await calculateCartTotal(req.user._id);

        return res.status(200).json({
            message: "Item removed from cart",
            success: true,
            cart,
            totalPrice: cartTotal
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error while removing from cart",
            success: false,
            error: error.message
        });
    }
};