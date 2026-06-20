import ProductModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";

export async function createProduct(req, res) {
    try {
        const { title, description, priceAmount, priceCurrency } = req.body;
        const seller = req.user;

        // 1. Group files by fieldname
        const baseFiles = [];
        const variantFilesGroup = {}; // e.g. { "variantImages_0": [file1, file2], "variantImages_1": [file3] }

        if (req.files) {
            req.files.forEach(file => {
                if (file.fieldname === "images") {
                    baseFiles.push(file);
                } else if (file.fieldname.startsWith("variantImages_")) {
                    if (!variantFilesGroup[file.fieldname]) {
                        variantFilesGroup[file.fieldname] = [];
                    }
                    variantFilesGroup[file.fieldname].push(file);
                }
            });
        }

        // 2. Upload base images
        const images = await Promise.all(baseFiles.map(async (file) => {
            const result = await uploadFile({
                buffer: file.buffer,
                fileName: file.originalname
            });
            return { url: result.url };
        }));

        // 3. Parse and process variants
        let parsedVariants = [];
        if (req.body.variants) {
            const rawVariants = JSON.parse(req.body.variants);
            
            parsedVariants = await Promise.all(rawVariants.map(async (v, index) => {
                // Upload variant-specific images
                let variantImages = [];
                const fieldName = `variantImages_${index}`;
                
                if (variantFilesGroup[fieldName]) {
                    variantImages = await Promise.all(variantFilesGroup[fieldName].map(async (file) => {
                        const result = await uploadFile({
                            buffer: file.buffer,
                            fileName: file.originalname
                        });
                        return { url: result.url };
                    }));
                }

                return {
                    stock: v.stock || 0,
                    attributes: v.attributes || {},
                    images: variantImages,
                    price: v.price ? {
                        amount: v.price.amount,
                        currency: v.price.currency || "INR"
                    } : undefined
                };
            }));
        }

        // 4. Create Product
        const product = await ProductModel.create({
            title,
            description,
            price: {
                amount: priceAmount,
                currency: priceCurrency || "INR"
            },
            image: images,
            variants: parsedVariants,
            seller: seller._id
        });

        res.status(201).json({
            message: "Product created successfully",
            success: true,
            product
        });

    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Failed to create product", success: false, error: error.message });
    }
}


export async function getSeller(req, res) {
    try {
        const seller = req.user;
        const products = await ProductModel.find({ seller: seller._id });

        res.status(200).json({
            message: "Products fetched successfully",
            success: true,
            products
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch products", success: false });
    }
}


export async function ShowAllProducts(req, res) {
    try {
        const products = await ProductModel.find();
        return res.status(200).json({
            message: "Products fetched successfully",
            success: true,
            products
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch products", success: false });
    }
}


export async function getProductDetails(req, res) {
    try {
        const { id } = req.params;
        const product = await ProductModel.findById(id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Product details fetched successfully",
            success: true,
            product
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch product details", success: false });
    }
}


export async function updateProduct(req, res) {
    try {
        const { id } = req.params;
        const { title, description, priceAmount, priceCurrency } = req.body;
        
        const product = await ProductModel.findOne({ _id: id, seller: req.user._id });
        if (!product) {
            return res.status(404).json({ message: "Product not found or unauthorized", success: false });
        }

        // Handle retained images
        let retainedImages = [];
        if (req.body.retainedImages) {
            retainedImages = JSON.parse(req.body.retainedImages);
        }

        // Handle new image uploads
        const newImages = [];
        if (req.files) {
            const filesToUpload = req.files.filter(f => f.fieldname === "newImages");
            for (const file of filesToUpload) {
                const result = await uploadFile({
                    buffer: file.buffer,
                    fileName: file.originalname
                });
                newImages.push({ url: result.url });
            }
        }

        // Combine retained and new images
        const finalImages = [...retainedImages, ...newImages];

        // Update product base info
        product.title = title || product.title;
        product.description = description || product.description;
        
        if (priceAmount) {
            product.price.amount = priceAmount;
            product.price.currency = priceCurrency || product.price.currency;
        }

        product.image = finalImages;

        await product.save();

        res.status(200).json({
            message: "Product updated successfully",
            success: true,
            product
        });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Failed to update product", success: false, error: error.message });
    }
}


export async function addProductVariant(req, res) {
    try {
        const { productid } = req.params;

        const product = await ProductModel.findOne({
            _id: productid,
            seller: req.user._id
        });

        if (!product) {
            return res.status(404).json({
                message: "Product not found or unauthorized",
                success: false
            });
        }

        // Parse variant data
        const variantData = JSON.parse(req.body.variant || "{}");

        // Process images (all files sent in this request are for this single variant)
        const files = req.files || [];
        const uploadedImages = await Promise.all(files.map(async (file) => {
            const result = await uploadFile({
                buffer: file.buffer,
                fileName: file.originalname
            });
            return { url: result.url };
        }));

        const newVariant = {
            stock: variantData.stock || 0,
            attributes: variantData.attributes || {},
            images: uploadedImages,
            price: variantData.priceAmount ? {
                amount: variantData.priceAmount,
                currency: variantData.priceCurrency || "INR"
            } : undefined
        };

        product.variants.push(newVariant);
        await product.save();

        res.status(200).json({
            message: "Variant added successfully",
            success: true,
            product
        });
    } catch (error) {
        console.error("Error adding variant:", error);
        res.status(500).json({ message: "Failed to add variant", success: false, error: error.message });
    }
}

export async function deleteProduct(req, res) {
    try {
        const { id } = req.params;
        const sellerId = req.user._id;

        const product = await ProductModel.findOneAndDelete({ _id: id, seller: sellerId });

        if (!product) {
            return res.status(404).json({
                message: "Product not found or you are not authorized to delete it",
                success: false
            });
        }

        res.status(200).json({
            message: "Product deleted successfully",
            success: true
        });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Failed to delete product", success: false, error: error.message });
    }
}