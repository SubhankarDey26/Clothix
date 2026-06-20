import { useEffect } from 'react';
import { useProduct } from '../hook/useProduct.js';
import { Package, ImageOff, Pencil, Trash2 } from 'lucide-react';
import {  useNavigate } from 'react-router';

const CURRENCY_SYMBOLS = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };

const MyProducts = () => {
  const { sellerProduct, loading, error, handleGetSellerProducts, handleDeleteProduct } = useProduct();
  const navigate = useNavigate();


  useEffect(() => {
    handleGetSellerProducts();
  }, []);

  const handleEditProduct = (productId) => {
    console.log('Edit Product:', productId);
    navigate(`/seller/product/${productId}`)

    // Navigate to edit page or open edit modal
    // navigate(`/seller/edit-product/${productId}`);
  };

  const handleDeleteProductClick = async (productId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this product? This action cannot be undone.'
    );

    if (!confirmed) return;

    try {
      console.log('Delete Product:', productId);
      await handleDeleteProduct(productId);
      // No need to manually refresh here, the hook handles it
    } catch (err) {
      console.error(err);
      alert("Failed to delete product.");
    }
  };

  /* ─── Loading State ─── */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="w-10 h-10 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-neutral-500 text-sm">Loading your products…</p>
      </div>
    );
  }

  /* ─── Error State ─── */
  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center">
        <p className="text-red-400 text-sm">{error}</p>
        <button
          onClick={handleGetSellerProducts}
          className="mt-4 px-5 py-2 text-sm font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  /* ─── Empty State ─── */
  if (!sellerProduct || sellerProduct.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-5">
        <div className="w-20 h-20 rounded-3xl bg-neutral-900 border border-neutral-800 flex items-center justify-center">
          <Package className="text-neutral-600" size={36} />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white mb-1">No products yet</h3>
          <p className="text-neutral-500 text-sm max-w-xs">
            Start by listing your first product — switch to the "Add Product" tab above.
          </p>
        </div>
      </div>
    );
  }

  /* ─── Products Grid ─── */
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {sellerProduct.map((product) => {
        const currency = product.price?.currency || 'INR';
        const amount = product.price?.amount;
        const currencySymbol = CURRENCY_SYMBOLS[currency] || currency;
        const thumbnail = product.image?.[0]?.url;

        return (
          <div
            key={product._id}
            className="group bg-neutral-900/60 border border-neutral-800/40 rounded-2xl overflow-hidden hover:border-yellow-500/30 hover:shadow-[0_0_25px_rgba(234,179,8,0.06)] transition-all duration-300"
          >
            {/* Image */}
            <div className="aspect-square bg-neutral-950/50 overflow-hidden relative">
              {thumbnail ? (
                <img
                  src={thumbnail}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageOff className="text-neutral-700" size={40} />
                </div>
              )}

              {/* Image count badge */}
              {product.image?.length > 1 && (
                <span className="absolute bottom-3 right-3 bg-neutral-950/70 backdrop-blur-sm text-neutral-300 text-[11px] font-medium px-2.5 py-1 rounded-full">
                  +{product.image.length - 1} more
                </span>
              )}
            </div>

            {/* Info */}
            <div className="p-5">
              <h3 className="text-base font-semibold text-neutral-100 mb-1 truncate">
                {product.title}
              </h3>

              <p className="text-sm text-neutral-500 line-clamp-2 mb-4 leading-relaxed">
                {product.description}
              </p>

              <div className="flex items-center justify-between mb-4">
                <p className="text-lg font-bold text-white">
                  {currencySymbol}
                  {amount}
                </p>

                <span className="text-[11px] font-medium text-yellow-500/70 bg-yellow-500/10 px-2.5 py-1 rounded-full">
                  {currency}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleEditProduct(product._id)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-sm font-medium transition-all duration-200"
                >
                  <Pencil size={16} />
                  Edit
                </button>

                <button
                  onClick={() => handleDeleteProductClick(product._id)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 text-sm font-medium transition-all duration-200"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MyProducts;