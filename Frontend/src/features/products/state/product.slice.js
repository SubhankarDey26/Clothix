import { createSlice } from "@reduxjs/toolkit";

const productSlice=createSlice({
    name:"product",
    initialState:{
        sellerProduct:[],
        products:[],
        loading:false,
        error:null
    },
    reducers:{
        setSellerProduct:(state,action)=>{
            state.sellerProduct=action.payload
        },
        setLoading:(state,action)=>{
            state.loading=action.payload
        },
        setError:(state,action)=>{
            state.error=action.payload
        },
        setProducts:(state,action)=>{
            state.products=action.payload
        }
    }
})


export const {setSellerProduct, setLoading, setError,setProducts}=productSlice.actions

export default productSlice.reducer