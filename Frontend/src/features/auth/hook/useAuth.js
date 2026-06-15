import {setError,setLoading,setUsers} from "../state/auth.slice.js"
import { register, login } from "../service/auth.api.js"
import { useDispatch } from "react-redux"

export const useAuth=()=>{

    const dispatch=useDispatch()

    // Handle user registration
    async function handleRegister({email,contact,password,fullname, isSeller=false})
    {
        try{
            dispatch(setLoading(true))
            // Call register API with individual parameters
            const data=await register(fullname, email, password, contact, isSeller)
            dispatch(setUsers(data.user))
            dispatch(setLoading(false))
            return data
        } catch(error){
            // Extract error message from validation errors array or response message
            const errorMsg = Array.isArray(error.response?.data?.errors) 
                ? error.response.data.errors.map(e => e.msg).join(", ")
                : error.response?.data?.message || error.message
            console.error("Register error details:", error.response?.data) // Debug logging
            dispatch(setError(errorMsg))
            dispatch(setLoading(false))
            throw error
        }
    }

    // Handle user login
    async function handleLogin({email,password})
    {
        try{
            dispatch(setLoading(true))
            // Call login API with email and password
            const data=await login(email, password)
            dispatch(setUsers(data.user))
            dispatch(setLoading(false))
            return data
        } catch(error){
            // Extract error message from validation errors array or response message
            const errorMsg = Array.isArray(error.response?.data?.errors) 
                ? error.response.data.errors.map(e => e.msg).join(", ")
                : error.response?.data?.message || error.message
            dispatch(setError(errorMsg))
            console.error("Login error details:", error.response?.data) // Debug logging
            dispatch(setLoading(false))
            throw error
        }
    }

    return {handleRegister, handleLogin}
}