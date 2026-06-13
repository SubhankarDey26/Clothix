import { createSlice } from "@reduxjs/toolkit";


const authSlice=createSlice({
    name:"auth",
    initialState:{
        user:null,
        loading:false,
        error:null
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
        }
    }
})


export const {setError,setLoading,setUsers}=authSlice.actions

export default authSlice.reducer