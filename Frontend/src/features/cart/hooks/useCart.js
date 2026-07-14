import { useDispatch, useSelector } from "react-redux";
import { setItems, setLoading, setError } from "../state/cart.slice";
import { addItemApi, getCartApi, updateItemQuantityApi, removeItemApi } from "../services/cart.api";

export const useCart = () => {
    const dispatch = useDispatch();
    const { items, cartId, totalPrice, loading, error } = useSelector((state) => state.cart);

    const handleGetCart = async () => {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const data = await getCartApi();
            if (data.success && data.cart) {
                dispatch(setItems({ ...data.cart, totalPrice: data.totalPrice }));
            }
            return data;
        } catch (error) {
            const errorMsg = Array.isArray(error.response?.data?.errors)
                ? error.response.data.errors.map((e) => e.msg).join(", ")
                : error.response?.data?.message || error.message;
            dispatch(setError(errorMsg));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleAddToCart = async (productId, variantId) => {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const data = await addItemApi({ productId, variantId });
            if (data.success && data.cart) {
                dispatch(setItems({ ...data.cart, totalPrice: data.totalPrice }));
            }
            return data;
        } catch (error) {
            const errorMsg = Array.isArray(error.response?.data?.errors)
                ? error.response.data.errors.map((e) => e.msg).join(", ")
                : error.response?.data?.message || error.message;
            dispatch(setError(errorMsg));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleUpdateQuantity = async (productId, variantId, quantity) => {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const data = await updateItemQuantityApi({ productId, variantId, quantity });
            if (data.success && data.cart) {
                dispatch(setItems({ ...data.cart, totalPrice: data.totalPrice }));
            }
            return data;
        } catch (error) {
            const errorMsg = Array.isArray(error.response?.data?.errors)
                ? error.response.data.errors.map((e) => e.msg).join(", ")
                : error.response?.data?.message || error.message;
            dispatch(setError(errorMsg));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleRemoveItem = async (productId, variantId) => {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const data = await removeItemApi({ productId, variantId });
            if (data.success && data.cart) {
                dispatch(setItems({ ...data.cart, totalPrice: data.totalPrice }));
            }
            return data;
        } catch (error) {
            const errorMsg = Array.isArray(error.response?.data?.errors)
                ? error.response.data.errors.map((e) => e.msg).join(", ")
                : error.response?.data?.message || error.message;
            dispatch(setError(errorMsg));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    return { items, cartId, totalPrice, loading, error, handleGetCart, handleAddToCart, handleUpdateQuantity, handleRemoveItem };
};