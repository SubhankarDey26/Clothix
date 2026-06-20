import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { useProduct } from '../hook/useProduct.js';
import { useAuth } from '../../auth/hook/useAuth.js';
import { useSelector } from 'react-redux';
import {
  ShoppingBag, ShoppingCart, Zap, ArrowLeft, ChevronLeft, ChevronRight,
  ImageOff, LogOut, Menu, X, Truck, Shield, RefreshCw, Check
} from 'lucide-react';

const CURRENCY_SYMBOLS = { INR: '₹', USD: '$', EUR: '€', GBP: '£', JPY: '¥' };

const ProductDetail = () => {
  const { productId } = useParams();
  const { handleProductDetailsById } = useProduct();
  const { handleLogout } = useAuth();
  const { user } = useSelector((state) => state.auth);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Variant State
  const [selectedVariant, setSelectedVariant] = useState(null);

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
  
  const images = (selectedVariant && selectedVariant.images && selectedVariant.images.length > 0) 
                  ? selectedVariant.images 
                  : (product?.image || []);
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

      {/* ═══ Navigation ═══ */}
      <nav className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <ShoppingBag className="text-yellow-500" size={24} />
            <span className="text-xl font-extrabold text-yellow-500 tracking-widest uppercase">CLOTHIX</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
            <Link to="/" className="hover:text-yellow-500 transition">Home</Link>
            <Link to="/buyer" className="hover:text-yellow-500 transition">Shop</Link>
            {user?.role === 'seller' && (
              <Link to="/seller" className="hover:text-yellow-500 transition">Seller Dashboard</Link>
            )}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <p className="text-sm text-neutral-400">{user.fullname || 'User'}</p>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 border border-neutral-800 text-neutral-300 font-medium rounded-full hover:border-red-500/50 hover:text-red-400 transition-all"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-5 py-2 text-neutral-300 font-medium hover:text-yellow-400 transition">Login</Link>
                <Link to="/register" className="px-5 py-2.5 bg-yellow-500 text-neutral-950 font-semibold rounded-full hover:bg-yellow-400 hover:shadow-[0_0_15px_rgba(234,179,8,0.3)] transition-all">Sign Up</Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-neutral-300 hover:text-yellow-500 transition">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-neutral-900/95 backdrop-blur-xl border-t border-neutral-800/50 animate-fade-in">
            <div className="px-6 py-6 space-y-4">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block text-neutral-300 font-medium hover:text-yellow-500 transition">Home</Link>
              <Link to="/buyer" onClick={() => setMobileMenuOpen(false)} className="block text-neutral-300 font-medium hover:text-yellow-500 transition">Shop</Link>
              {user?.role === 'seller' && (
                <Link to="/seller" onClick={() => setMobileMenuOpen(false)} className="block text-neutral-300 font-medium hover:text-yellow-500 transition">Seller Dashboard</Link>
              )}
              <hr className="border-neutral-800" />
              {user ? (
                <>
                  <p className="text-sm text-neutral-400">{user.fullname || 'User'}</p>
                  <button
                    onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-neutral-800 border border-neutral-700 text-red-400 font-bold rounded-full hover:bg-neutral-700 transition"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block text-neutral-300 font-medium hover:text-yellow-400 transition">Login</Link>
                  <Link to="/register" className="block text-center py-3 bg-yellow-500 text-neutral-950 font-bold rounded-full hover:bg-yellow-400 transition">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>


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
                        <Check size={12} /> In Stock ({stock})
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
                  className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-full font-bold text-lg border transition-all
                    ${product.variants && stock <= 0
                      ? 'bg-transparent border-neutral-800 text-neutral-600 cursor-not-allowed'
                      : 'bg-neutral-900 border-neutral-700 text-white hover:bg-neutral-800 hover:border-neutral-600 transform active:scale-95'
                    }
                  `}
                  disabled={product.variants && stock <= 0}
                >
                  <ShoppingCart size={20} />
                  Add to Cart
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
