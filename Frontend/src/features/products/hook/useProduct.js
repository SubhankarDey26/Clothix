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
  getproductById,
  addProductVariant
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

  // Handle adding variant to product
  const handleAddProductVariant = async (productId, formData) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const data = await addProductVariant(productId, formData);
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

  const handleProductDetailsById=async(productId)=>{
    const data=await getproductById(productId)
    return data.product
  }

  return {
    sellerProduct,
    products,
    loading,
    error,
    handleCreateProduct,
    handleAddProductVariant,
    handleGetSellerProducts,
    handleGetAllProduct,
    handleProductDetailsById
  };
};
