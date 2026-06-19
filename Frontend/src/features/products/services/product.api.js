import axios from "axios";

const productApiInstance=axios.create({
    baseURL:"/api/products",
    withCredentials:true
})


export async function createProduct({ title, description, priceAmount, priceCurrency, images }) {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("priceAmount", priceAmount);
    formData.append("priceCurrency", priceCurrency);

    // Append each image file — multer's upload.any() picks these up from req.files
    if (images && images.length > 0) {
        images.forEach((file) => {
            formData.append("images", file);
        });
    }

    const response = await productApiInstance.post("/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
}


export async function getSellerProduct()
{
    const response=await productApiInstance.get("/seller")


    return response.data
}

export async function getallproducts()
{
    const response = await productApiInstance.get("/")
    return response.data
}