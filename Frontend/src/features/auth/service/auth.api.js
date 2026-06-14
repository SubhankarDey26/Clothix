import axios from "axios";

// Axios instance for authentication API calls
const authApiInstance=axios.create({
    // baseURL:"http://localhost:3000/api/auth",
    baseURL:"/api/auth",
    withCredentials:true
})

// Register a new user
export async function register(fullname,email,password,contact,isSeller) {
    const response=await authApiInstance.post("/register",{
        email,
        contact,
        fullname,
        password,
        role: isSeller ? "seller" : "buyer" // Convert isSeller to role
    })
    return response.data
}

// Login an existing user
export async function login(email,password) {
    const response=await authApiInstance.post("/login",{
        email,
        password
    })
    return response.data
}