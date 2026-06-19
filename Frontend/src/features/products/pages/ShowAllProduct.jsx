import { useEffect, useState, useRef } from 'react';
import { useProduct } from '../hook/useProduct.js';
import { Link } from 'react-router';
import { ShoppingBag, ImageOff, Search, SlidersHorizontal, X, Menu, ArrowUp } from 'lucide-react';

const CURRENCY_SYMBOLS = { INR: '₹', USD: '$', EUR: '€', GBP: '£', JPY: '¥' };

/* ─── Intersection Observer Hook ─── */
const useInView = (options = {}) => {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1, ...options });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, isInView];
};

/* ─── Product Card ─── */
const ProductCard = ({ product, index }) => {
  const [ref, isInView] = useInView();
  const [isHovered, setIsHovered] = useState(false);

  const currency = product.price?.currency || 'INR';
  const amount = product.price?.amount;
  const currencySymbol = CURRENCY_SYMBOLS[currency] || currency;
  const thumbnail = product.image?.[0]?.url;

  return (
    <div
      ref={ref}
      className={`group relative bg-neutral-900/60 rounded-2xl border border-neutral-800/40 overflow-hidden transition-all duration-500 hover:border-yellow-500/30 hover:shadow-[0_0_30px_rgba(234,179,8,0.08)] ${isInView ? 'animate-fade-in-up' : 'opacity-0'}`}
      style={{ animationDelay: `${index * 0.06}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-neutral-950/50">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={product.title}
            className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageOff className="text-neutral-700" size={40} />
          </div>
        )}

        {/* Gradient overlay on hover */}
        <div className={`absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>

        {/* Image count badge */}
        {product.image?.length > 1 && (
          <span className="absolute bottom-3 right-3 bg-neutral-950/70 backdrop-blur-sm text-neutral-300 text-[11px] font-medium px-2.5 py-1 rounded-full">
            +{product.image.length - 1} more
          </span>
        )}

        {/* Quick view button on hover */}
        <div className={`absolute bottom-4 left-4 right-4 transition-all duration-400 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <button className="w-full py-3 bg-yellow-500 text-neutral-950 font-bold text-sm rounded-xl hover:bg-yellow-400 transition active:scale-[0.97]">
            Quick View
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5">
        {/* Category tag */}
        {product.category && (
          <p className="text-xs text-yellow-500/70 font-medium uppercase tracking-widest mb-1.5">
            {product.category}
          </p>
        )}

        <h3 className="text-base font-semibold text-neutral-100 mb-1.5 truncate">
          {product.title}
        </h3>

        <p className="text-sm text-neutral-500 line-clamp-2 mb-4 leading-relaxed">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-white">
            {currencySymbol}{amount}
          </p>
          <span className="text-[11px] font-medium text-yellow-500/70 bg-yellow-500/10 px-2.5 py-1 rounded-full">
            {currency}
          </span>
        </div>
      </div>
    </div>
  );
};


/* ─── Main Page Component ─── */
const ShowAllProduct = () => {
  const { products, loading, error, handleGetAllProduct } = useProduct();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    handleGetAllProduct();
  }, []);

  // Show/hide scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ─── Filtering & Sorting ─── */
  const filteredProducts = (products || [])
    .filter((product) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        product.title?.toLowerCase().includes(q) ||
        product.description?.toLowerCase().includes(q) ||
        product.category?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.price?.amount || 0) - (b.price?.amount || 0);
        case 'price-high':
          return (b.price?.amount || 0) - (a.price?.amount || 0);
        case 'name':
          return (a.title || '').localeCompare(b.title || '');
        case 'newest':
        default:
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
    });


  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 font-sans relative">

      {/* ═══ Navigation ═══ */}
      <nav className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <ShoppingBag className="text-yellow-500" size={24} />
            <span className="text-xl font-extrabold text-yellow-500 tracking-widest uppercase">CLOTHIX</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
            <Link to="/" className="hover:text-yellow-500 transition">Home</Link>
            <Link to="/buyer" className="text-yellow-500">Shop</Link>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="px-5 py-2 text-neutral-300 font-medium hover:text-yellow-400 transition">
              Login
            </Link>
            <Link to="/register" className="px-5 py-2.5 bg-yellow-500 text-neutral-950 font-semibold rounded-full hover:bg-yellow-400 hover:shadow-[0_0_15px_rgba(234,179,8,0.3)] transition-all">
              Sign Up
            </Link>
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
              <Link to="/buyer" onClick={() => setMobileMenuOpen(false)} className="block text-yellow-500 font-medium">Shop</Link>
              <hr className="border-neutral-800" />
              <Link to="/login" className="block text-neutral-300 font-medium hover:text-yellow-400 transition">Login</Link>
              <Link to="/register" className="block text-center py-3 bg-yellow-500 text-neutral-950 font-bold rounded-full hover:bg-yellow-400 transition">Sign Up</Link>
            </div>
          </div>
        )}
      </nav>


      {/* ═══ Page Header ═══ */}
      <section className="pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-yellow-500 text-sm font-bold uppercase tracking-widest mb-3 animate-fade-in-up">Explore</p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight animate-fade-in-up delay-100">
              All Products
            </h1>
            <p className="text-neutral-400 text-base md:text-lg font-light mt-4 max-w-lg mx-auto animate-fade-in-up delay-200">
              Discover our curated collection of premium, minimalist clothing.
            </p>
          </div>

          {/* ─── Search & Filters Bar ─── */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between animate-fade-in-up delay-300">

            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products…"
                className="w-full bg-neutral-900/60 border border-neutral-800/50 text-neutral-100 rounded-xl pl-11 pr-5 py-3 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/30 transition duration-300 placeholder-neutral-600 text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Sort & Filter Toggle */}
            <div className="flex items-center gap-3">
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-neutral-900/60 border border-neutral-800/50 text-neutral-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-yellow-500/50 transition appearance-none cursor-pointer"
              >
                <option value="newest" className="bg-neutral-900">Newest First</option>
                <option value="price-low" className="bg-neutral-900">Price: Low → High</option>
                <option value="price-high" className="bg-neutral-900">Price: High → Low</option>
                <option value="name" className="bg-neutral-900">Name: A → Z</option>
              </select>

              {/* Filter toggle (visual) */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-3 rounded-xl border transition-all duration-300 ${showFilters
                  ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500'
                  : 'bg-neutral-900/60 border-neutral-800/50 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
                  }`}
              >
                <SlidersHorizontal size={18} />
              </button>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-6 flex items-center gap-2">
            <span className="text-sm text-neutral-500">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
            </span>
            {searchQuery && (
              <span className="text-sm text-neutral-600">
                for "<span className="text-yellow-500/70">{searchQuery}</span>"
              </span>
            )}
          </div>
        </div>
      </section>


      {/* ═══ Main Content ═══ */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-6">

          {/* ─── Loading State ─── */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <div className="w-10 h-10 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-neutral-500 text-sm">Loading products…</p>
            </div>
          )}

          {/* ─── Error State ─── */}
          {!loading && error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-10 text-center max-w-md mx-auto">
              <p className="text-red-400 text-sm mb-4">{error}</p>
              <button
                onClick={handleGetAllProduct}
                className="px-6 py-2.5 text-sm font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl transition"
              >
                Try Again
              </button>
            </div>
          )}

          {/* ─── Empty State ─── */}
          {!loading && !error && filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 gap-6">
              <div className="w-20 h-20 rounded-3xl bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                <ShoppingBag className="text-neutral-600" size={36} />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-2">
                  {searchQuery ? 'No matching products' : 'No products available'}
                </h3>
                <p className="text-neutral-500 text-sm max-w-xs">
                  {searchQuery
                    ? 'Try a different search term or clear your filters.'
                    : 'Products will appear here once sellers start listing.'}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-5 px-5 py-2 text-sm font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-xl hover:bg-yellow-500/20 transition"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ─── Products Grid ─── */}
          {!loading && !error && filteredProducts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, i) => (
                <ProductCard key={product._id} product={product} index={i} />
              ))}
            </div>
          )}

        </div>
      </section>


      {/* ═══ Scroll to Top Button ═══ */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 p-3 bg-yellow-500 text-neutral-950 rounded-full shadow-lg hover:bg-yellow-400 hover:shadow-[0_0_20px_rgba(234,179,8,0.3)] transition-all duration-300 animate-fade-in-up"
        >
          <ArrowUp size={20} />
        </button>
      )}


      {/* ═══ Footer ═══ */}
      <footer className="border-t border-neutral-800/50 bg-neutral-950 py-12">
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

export default ShowAllProduct;