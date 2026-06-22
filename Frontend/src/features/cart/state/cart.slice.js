import { createSlice } from "@reduxjs/toolkit"

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: [],
        cartId: null,
        loading: false,
        error: null
    },
    reducers: {
        setItems: (state, action) => {
            state.items = action.payload.items || [];
            state.cartId = action.payload._id || null;
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