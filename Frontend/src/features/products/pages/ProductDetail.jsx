import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { useProduct } from '../hook/useProduct.js';
import { useAuth } from '../../auth/hook/useAuth.js';
import { useSelector } from 'react-redux';
import {
  ShoppingBag, ShoppingCart, Zap, ArrowLeft, ChevronLeft, ChevronRight,
  ImageOff, LogOut, Menu, X, Truck, Shield, RefreshCw
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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await handleProductDetailsById(productId);
        setProduct(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const currency = product?.price?.currency || 'INR';
  const amount = product?.price?.amount;
  const currencySymbol = CURRENCY_SYMBOLS[currency] || currency;
  const images = product?.image || [];
  const selectedImage = images[selectedImageIndex]?.url;

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
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
                {product.title}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-8">
                <p className="text-3xl md:text-4xl font-extrabold text-yellow-500">
                  {currencySymbol}{amount}
                </p>
                <span className="text-sm font-medium text-neutral-500 bg-neutral-900 px-3 py-1 rounded-full">
                  {currency}
                </span>
              </div>

              {/* Divider */}
              <div className="border-t border-neutral-800/50 mb-8"></div>

              {/* Description */}
              <div className="mb-10">
                <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider mb-3">
                  Description
                </h3>
                <p className="text-neutral-400 text-base leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              {/* Product Meta */}
              <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="bg-neutral-900/50 border border-neutral-800/40 rounded-xl p-4">
                  <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Images</p>
                  <p className="text-sm font-semibold text-neutral-200">{images.length} photo{images.length !== 1 ? 's' : ''}</p>
                </div>
                <div className="bg-neutral-900/50 border border-neutral-800/40 rounded-xl p-4">
                  <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Listed</p>
                  <p className="text-sm font-semibold text-neutral-200">
                    {product.createdAt
                      ? new Date(product.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                      : '—'
                    }
                  </p>
                </div>
              </div>

              {/* ─── Action Buttons ─── */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <button
                  className="flex-1 flex items-center justify-center gap-2.5 py-4 bg-yellow-500 text-neutral-950 font-bold text-base rounded-2xl hover:bg-yellow-400 hover:shadow-[0_0_25px_rgba(234,179,8,0.3)] focus:outline-none focus:ring-4 focus:ring-yellow-500/50 transition-all duration-300 transform active:scale-[0.98]"
                >
                  <Zap size={20} />
                  Buy Now
                </button>
                <button
                  className="flex-1 flex items-center justify-center gap-2.5 py-4 bg-neutral-900 border border-neutral-800 text-neutral-200 font-bold text-base rounded-2xl hover:border-yellow-500/40 hover:text-yellow-500 hover:shadow-[0_0_20px_rgba(234,179,8,0.08)] focus:outline-none focus:ring-4 focus:ring-neutral-700/50 transition-all duration-300 transform active:scale-[0.98]"
                >
                  <ShoppingCart size={20} />
                  Add to Cart
                </button>
              </div>

              {/* ─── Trust Badges ─── */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: <Truck size={20} />, label: 'Free Shipping', sub: 'On orders above ₹999' },
                  { icon: <Shield size={20} />, label: 'Secure Payment', sub: '100% encrypted' },
                  { icon: <RefreshCw size={20} />, label: 'Easy Returns', sub: '15-day window' },
                ].map((badge, i) => (
                  <div key={i} className="flex items-start gap-3 bg-neutral-900/30 border border-neutral-800/30 rounded-xl p-4">
                    <div className="text-yellow-500/70 mt-0.5">{badge.icon}</div>
                    <div>
                      <p className="text-xs font-semibold text-neutral-300">{badge.label}</p>
                      <p className="text-[11px] text-neutral-600">{badge.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}
      </main>


      {/* ═══ Footer ═══ */}
      <footer className="border-t border-neutral-800/50 bg-neutral-950 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="text-yellow-500" size={18} />
              <span className="text-sm font-extrabold text-yellow-500 tracking-widest uppercase">CLOTHIX</span>
            </div>
            <p className="text-neutral-600 text-sm">© 2026 CLOTHIX. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-neutral-600 text-sm hover:text-yellow-500 transition">Privacy</a>
              <a href="#" className="text-neutral-600 text-sm hover:text-yellow-500 transition">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProductDetail;
