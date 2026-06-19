import { createSlice } from "@reduxjs/toolkit";


const authSlice=createSlice({
    name:"auth",
    initialState:{
        user:null,
        loading:false,
        error:null,
        authChecked:false  // true once the initial /me check completes (success or failure)
    },
    reducers:{
        setUsers:(state,action)=>{
            state.user=action.payload;
        },
        setLoading:(state,action)=>{
            state.loading=action.payload
        },
        setError:(state,action)=>{
            state.error=action.payload
        },
        setAuthChecked:(state,action)=>{
            state.authChecked=action.payload
        }
    }
})


export const {setError,setLoading,setUsers,setAuthChecked}=authSlice.actions

export default authSlice.reducer