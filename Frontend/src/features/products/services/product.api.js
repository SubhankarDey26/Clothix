import axios from "axios";

const productApiInstance = axios.create({
    baseURL: "/api/products",
    withCredentials: true
});

export async function createProduct({ title, description, priceAmount, priceCurrency, images, variants = [] }) {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("priceAmount", priceAmount);
    formData.append("priceCurrency", priceCurrency);

    // Base Images
    if (images && images.length > 0) {
        images.forEach((file) => {
            formData.append("images", file);
        });
    }

    // Variants Parsing
    if (variants && variants.length > 0) {
        const variantsPayload = variants.map((v, index) => {
            // Append variant-specific images dynamically
            if (v.images && v.images.length > 0) {
                v.images.forEach(file => {
                    formData.append(`variantImages_${index}`, file);
                });
            }
            
            // Return clean JSON-serializable data without File objects
            return {
                stock: v.stock,
                attributes: v.attributes,
                price: v.price
            };
        });
        
        formData.append("variants", JSON.stringify(variantsPayload));
    }

    const response = await productApiInstance.post("/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
}

export async function getSellerProduct() {
    const response = await productApiInstance.get("/seller");
    return response.data;
}

export async function getallproducts() {
    const response = await productApiInstance.get("/");
    return response.data;
}

export async function getproductById(productId) {
    const response = await productApiInstance.get(`/detail/${productId}`);
    return response.data;
}

export async function addProductVariant(productId, { variant }) {
    const formData = new FormData();
    
    const variantPayload = {
        attributes: variant.attributes,
        stock: variant.stock,
        priceAmount: variant.price?.amount || variant.priceAmount,
        priceCurrency: variant.price?.currency || variant.priceCurrency,
    };
    
    formData.append("variant", JSON.stringify(variantPayload));

    if (variant.images && variant.images.length > 0) {
        variant.images.forEach(file => {
            formData.append("variantImages", file); 
        });
    }

    const response = await productApiInstance.post(`/${productId}/variants`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    
    return response.data;
}

export async function updateProduct(productId, { title, description, priceAmount, priceCurrency, retainedImages, newImages }) {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("priceAmount", priceAmount);
    formData.append("priceCurrency", priceCurrency);
    
    if (retainedImages) {
        formData.append("retainedImages", JSON.stringify(retainedImages));
    }

    if (newImages && newImages.length > 0) {
        newImages.forEach(file => {
            formData.append("newImages", file);
        });
    }

    const response = await productApiInstance.put(`/${productId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    
    return response.data;
}

export async function deleteProduct(productId) {
    const response = await productApiInstance.delete(`/${productId}`);
    return response.data;
}