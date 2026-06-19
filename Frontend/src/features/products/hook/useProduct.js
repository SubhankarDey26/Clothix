import { useDispatch, useSelector } from "react-redux";
import {
  setSellerProduct,
  setLoading,
  setError,
  setProducts,
} from "../state/product.slice.js";
import {
  createProduct,
  getSellerProduct,
  getallproducts,
} from "../services/product.api.js";

export const useProduct = () => {
  const dispatch = useDispatch();

  // Get state from redux store
  const { sellerProduct, products, loading, error } = useSelector(
    (state) => state.product,
  );

  // Handle product creation (expects multipart/form-data or product data)
  const handleCreateProduct = async (formData) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const data = await createProduct(formData);
      // Automatically refresh seller products on success
      await handleGetSellerProducts();
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

  // Handle fetching seller's products
  const handleGetSellerProducts = async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const data = await getSellerProduct();
      dispatch(setSellerProduct(data.products || []));
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

  // Handle fetching all products (public)
  const handleGetAllProduct = async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const data = await getallproducts();
      dispatch(setProducts(data.products || []));
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

  return {
    sellerProduct,
    products,
    loading,
    error,
    handleCreateProduct,
    handleGetSellerProducts,
    handleGetAllProduct,
  };
};
