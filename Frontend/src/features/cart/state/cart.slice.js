import { createSlice } from "@reduxjs/toolkit"

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: [],
        cartId: null,
        totalPrice: 0,
        loading: false,
        error: null
    },
    reducers: {
        setItems: (state, action) => {
            state.items = action.payload.items || [];
            state.cartId = action.payload._id || null;
            state.totalPrice = action.payload.totalPrice || 0;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    }
})

export const { setItems, setLoading, setError } = cartSlice.actions

export default cartSlice.reducer