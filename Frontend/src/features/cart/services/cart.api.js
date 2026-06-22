import axios from "axios"

const cartApiInstance = axios.create({
    baseURL: "/api/cart",
    withCredentials: true
})

export const addItemApi = async ({ productId, variantId }) => {
    const response = await cartApiInstance.post(`/add/${productId}/${variantId}`, {
        quantity: 1
    })
    return response.data
}

export const getCartApi = async () => {
    const response = await cartApiInstance.get("/")
    return response.data
}

export const updateItemQuantityApi = async ({ productId, variantId, quantity }) => {
    const response = await cartApiInstance.put(`/update/${productId}/${variantId}`, {
        quantity
    })
    return response.data
}

export const removeItemApi = async ({ productId, variantId }) => {
    const response = await cartApiInstance.delete(`/remove/${productId}/${variantId}`)
    return response.data
}