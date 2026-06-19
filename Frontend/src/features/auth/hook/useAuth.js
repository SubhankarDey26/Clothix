import {setError,setLoading,setUsers,setAuthChecked} from "../state/auth.slice.js"
import { register, login, getMe } from "../service/auth.api.js"
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

    // Check if user is already logged in via cookie (called once on app mount)
    async function HandleGetMe() {
        try{
            const data=await getMe()
            dispatch(setUsers(data.user))
        }
        catch(err){
            // Not logged in or token expired — this is expected, not an error
            dispatch(setUsers(null))
        }
        finally{
            // Mark auth check as complete regardless of outcome
            dispatch(setAuthChecked(true))
        }
    }

    return {handleRegister, handleLogin, HandleGetMe}
}