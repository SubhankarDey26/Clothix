import { useDispatch, useSelector } from "react-redux"
import { setSellerProduct, setLoading, setError } from "../state/product.slice.js"
import { createProduct, getSellerProduct } from "../services/product.api.js"

export const useProduct = () => {
  const dispatch = useDispatch()

  // Get state from redux store
  const { sellerProduct, loading, error } = useSelector((state) => state.product)

  // Handle product creation (expects multipart/form-data or product data)
  const handleCreateProduct = async (formData) => {
    try {
      dispatch(setLoading(true))
      dispatch(setError(null))
      const data = await createProduct(formData)
      // Automatically refresh seller products on success
      await handleGetSellerProducts()
      return data
    } catch (error) {
      const errorMsg = Array.isArray(error.response?.data?.errors)
        ? error.response.data.errors.map((e) => e.msg).join(", ")
        : error.response?.data?.message || error.message
      dispatch(setError(errorMsg))
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }

  // Handle fetching seller's products
  const handleGetSellerProducts = async () => {
    try {
      dispatch(setLoading(true))
      dispatch(setError(null))
      const data = await getSellerProduct()
      dispatch(setSellerProduct(data.products || []))
      return data
    } catch (error) {
      const errorMsg = Array.isArray(error.response?.data?.errors)
        ? error.response.data.errors.map((e) => e.msg).join(", ")
        : error.response?.data?.message || error.message
      dispatch(setError(errorMsg))
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }

  return {
    sellerProduct,
    loading,
    error,
    handleCreateProduct,
    handleGetSellerProducts,
  }
}
