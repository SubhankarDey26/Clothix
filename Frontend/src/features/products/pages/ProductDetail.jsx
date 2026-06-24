import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { useProduct } from '../hook/useProduct.js';
import { useCart } from '../../cart/hooks/useCart.js';
import {
  ShoppingCart, Zap, ArrowLeft, ChevronLeft, ChevronRight,
  ImageOff, Truck, Shield, RefreshCw, Check
} from 'lucide-react';
import Nav from '../../shared/components/Nav.jsx';

const CURRENCY_SYMBOLS = { INR: '₹', USD: '$', EUR: '€', GBP: '£', JPY: '¥' };

const ProductDetail = () => {
  const { productId } = useParams();
  const { handleProductDetailsById } = useProduct();
  const { items, handleAddToCart, loading: cartLoading } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [toast, setToast] = useState(null); // { message, type }
  
  // Variant State
  const [selectedVariant, setSelectedVariant] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await handleProductDetailsById(productId);
        setProduct(data);
        
        // Auto-select first variant if exists
        if (data && data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  // Derived state based on variant selection
  const currency = selectedVariant?.price?.currency || product?.price?.currency || 'INR';
  const amount = selectedVariant?.price?.amount || product?.price?.amount;
  const currencySymbol = CURRENCY_SYMBOLS[currency] || currency;
  
  const baseImages = product?.image || [];
  const variantImages = (selectedVariant && selectedVariant.images && selectedVariant.images.length > 0) 
                  ? selectedVariant.images 
                  : [];
                  
  const images = [...baseImages, ...variantImages];
  const selectedImage = images[selectedImageIndex]?.url;

  const stock = selectedVariant ? selectedVariant.stock : 0;

  // Reset image index when variant changes to ensure we don't look for out of bounds image index
  useEffect(() => {
    setSelectedImageIndex(0);
  }, [selectedVariant]);

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };


  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 font-sans">

      {/* ═══ Toast Notification ═══ */}
      <style>{`
        @keyframes toast-in {
          0%   { opacity: 0; transform: translateX(110%) scale(0.9); }
          60%  { transform: translateX(-6%) scale(1.02); }
          100% { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes toast-out {
          0%   { opacity: 1; transform: translateX(0) scale(1); }
          100% { opacity: 0; transform: translateX(110%) scale(0.9); }
        }
        @keyframes progress-shrink {
          from { width: 100%; }
          to   { width: 0%; }
        }
        .toast-enter { animation: toast-in 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .toast-bar   { animation: progress-shrink 3s linear forwards; }
      `}</style>

      {toast && (
        <div className="toast-enter fixed top-6 right-6 z-[9999] min-w-[280px] max-w-[360px] rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.5)]"
          style={{ background: 'rgba(15,15,15,0.97)', border: toast.type === 'success' ? '1px solid rgba(234,179,8,0.4)' : '1px solid rgba(239,68,68,0.4)' }}
        >
          <div className="flex items-start gap-3 p-4">
            {/* Icon */}
            <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${toast.type === 'success' ? 'bg-yellow-500/15 text-yellow-500' : 'bg-red-500/15 text-red-400'}`}>
              {toast.type === 'success' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              )}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0 pt-0.5">
              <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: toast.type === 'success' ? '#eab308' : '#f87171' }}>
                {toast.type === 'success' ? 'Added to Cart' : 'Error'}
              </p>
              <p className="text-sm text-neutral-300 leading-snug line-clamp-2">{toast.message}</p>
            </div>

            {/* Close */}
            <button onClick={() => setToast(null)} className="flex-shrink-0 text-neutral-600 hover:text-neutral-300 transition mt-0.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Progress bar */}
          <div className="h-0.5 w-full bg-neutral-800">
            <div className="toast-bar h-full" style={{ background: toast.type === 'success' ? '#eab308' : '#ef4444' }} />
          </div>
        </div>
      )}

      {/* ═══ Navigation ═══ */}
      <Nav showHomeShop={false} />


      {/* ═══ Back Link ═══ */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <Link
          to="/buyer"
          className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-yellow-500 transition group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Shop
        </Link>
      </div>


      {/* ═══ Main Content ═══ */}
      <main className="max-w-7xl mx-auto px-6 py-10 md:py-16">

        {/* ─── Loading ─── */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-10 h-10 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-neutral-500 text-sm">Loading product details…</p>
          </div>
        )}

        {/* ─── Error ─── */}
        {!loading && error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-10 text-center max-w-md mx-auto">
            <p className="text-red-400 text-sm mb-4">{error}</p>
            <Link
              to="/buyer"
              className="px-6 py-2.5 text-sm font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl transition inline-block"
            >
              Go Back to Shop
            </Link>
          </div>
        )}

        {/* ─── Product Detail ─── */}
        {!loading && !error && product && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

            {/* ════ Left — Images ════ */}
            <div className="space-y-5">
              {/* Main Image */}
              <div className="relative aspect-square bg-neutral-900/60 rounded-3xl overflow-hidden border border-neutral-800/40">
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt={product.title}
                    className="w-full h-full object-cover transition-all duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageOff className="text-neutral-700" size={60} />
                  </div>
                )}

                {/* Image navigation arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 bg-neutral-950/70 backdrop-blur-sm rounded-full text-neutral-300 hover:text-yellow-500 hover:bg-neutral-950/90 transition"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 bg-neutral-950/70 backdrop-blur-sm rounded-full text-neutral-300 hover:text-yellow-500 hover:bg-neutral-950/90 transition"
                    >
                      <ChevronRight size={20} />
                    </button>

                    {/* Image counter */}
                    <span className="absolute bottom-4 right-4 bg-neutral-950/70 backdrop-blur-sm text-neutral-300 text-xs font-medium px-3 py-1.5 rounded-full">
                      {selectedImageIndex + 1} / {images.length}
                    </span>
                  </>
                )}
              </div>

              {/* Thumbnail Strip */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300
                        ${index === selectedImageIndex
                          ? 'border-yellow-500 shadow-[0_0_12px_rgba(234,179,8,0.2)]'
                          : 'border-neutral-800/50 hover:border-neutral-700 opacity-60 hover:opacity-100'
                        }`}
                    >
                      <img
                        src={img.url}
                        alt={`${product.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>


            {/* ════ Right — Product Info ════ */}
            <div className="flex flex-col">

              {/* Category */}
              {product.category && (
                <span className="inline-block text-xs font-bold uppercase tracking-widest text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1.5 rounded-full w-fit mb-5">
                  {product.category}
                </span>
              )}

              {/* Title */}
              <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
                {product.title}
              </h1>

              {/* Price */}
              <div className="flex items-end gap-3 mb-8">
                {amount ? (
                  <span className="text-3xl font-black text-yellow-500">
                    {currencySymbol}{amount}
                  </span>
                ) : (
                  <span className="text-2xl font-bold text-neutral-500">Price unavailable</span>
                )}
              </div>
              
              {/* Variants Section */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-8 p-6 bg-neutral-900/40 border border-neutral-800/60 rounded-3xl">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center justify-between">
                    <span>Available Options</span>
                    {stock > 0 ? (
                      <span className="text-xs text-green-400 flex items-center gap-1 bg-green-400/10 px-2 py-1 rounded">
                        <Check size={12} /> In Stock
                      </span>
                    ) : (
                      <span className="text-xs text-red-400 flex items-center gap-1 bg-red-400/10 px-2 py-1 rounded">
                        Out of Stock
                      </span>
                    )}
                  </h3>
                  
                  <div className="flex flex-wrap gap-3">
                    {product.variants.map((v) => {
                      const isSelected = selectedVariant?._id === v._id;
                      
                      // Format attributes for display
                      let attrLabel = "Variant";
                      if (v.attributes) {
                        attrLabel = Object.entries(v.attributes).map(([key, val]) => `${key}: ${val}`).join(' | ');
                      }
                      
                      return (
                        <button
                          key={v._id}
                          onClick={() => setSelectedVariant(v)}
                          className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-300
                            ${isSelected 
                              ? 'bg-yellow-500 text-neutral-950 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]' 
                              : 'bg-neutral-950 text-neutral-300 border-neutral-700 hover:border-yellow-500/50 hover:bg-neutral-900'}
                          `}
                        >
                          {attrLabel}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="mb-10">
                <h3 className="text-sm font-bold text-neutral-300 uppercase tracking-wider mb-3">Description</h3>
                <p className="text-neutral-400 leading-relaxed font-light">
                  {product.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-auto border-t border-neutral-800/50 pt-8">
                <button
                  className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-full font-bold text-lg transition-all
                    ${product.variants && stock <= 0
                      ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                      : 'bg-yellow-500 text-neutral-950 hover:bg-yellow-400 hover:shadow-[0_0_20px_rgba(234,179,8,0.3)] transform active:scale-95'
                    }
                  `}
                  disabled={product.variants && stock <= 0}
                >
                  <Zap size={20} />
                  Buy Now
                </button>
                <button
                  onClick={async () => {
                    if (product && selectedVariant) {
                      try {
                        await handleAddToCart(product._id, selectedVariant._id);
                        showToast(`${product.title} added to cart!`, 'success');
                      } catch (err) {
                        showToast(
                          err?.response?.data?.message || 'Failed to add item.',
                          'error'
                        );
                      }
                    }
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-full font-bold text-lg border transition-all
                    ${(product.variants && stock <= 0) || cartLoading
                      ? 'bg-transparent border-neutral-800 text-neutral-600 cursor-not-allowed'
                      : 'bg-neutral-900 border-neutral-700 text-white hover:bg-neutral-800 hover:border-neutral-600 transform active:scale-95'
                    }
                  `}
                  disabled={(product.variants && stock <= 0) || cartLoading}
                >
                  {cartLoading ? (
                    <div className="w-5 h-5 border-2 border-neutral-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <ShoppingCart size={20} />
                  )}
                  {cartLoading ? 'Adding...' : 'Add to Cart'}
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-neutral-800/30">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center text-yellow-500">
                    <Truck size={18} />
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">Fast Delivery</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center text-yellow-500">
                    <RefreshCw size={18} />
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">7-Day Return</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center text-yellow-500">
                    <Shield size={18} />
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">Secure Pay</span>
                </div>
              </div>

            </div>
          </div>
        )}
      </main>

      {/* ═══ Footer ═══ */}
      <div className="border-t border-neutral-900 py-8 text-center bg-neutral-950">
        <p className="text-neutral-700 text-sm">© 2026 CLOTHIX</p>
      </div>

    </div>
  );
};

export default ProductDetail;
