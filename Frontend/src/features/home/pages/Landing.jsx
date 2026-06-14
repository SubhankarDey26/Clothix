import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ShoppingBag, Sparkles, Star, Truck, Shield, RefreshCw, ChevronRight, Menu, X } from 'lucide-react';
import { Link } from 'react-router';

/* ─── Data ─── */
const PRODUCTS = [
  { id: 1, name: "Shadow Oversized Tee", price: "₹1,499", category: "T-Shirts", image: "/images/product_black_tshirt.png", badge: "Bestseller" },
  { id: 2, name: "Sahara Linen Shirt", price: "₹2,199", category: "Shirts", image: "/images/product_beige_shirt.png", badge: "New" },
  { id: 3, name: "Nomad Cargo Joggers", price: "₹1,899", category: "Bottomwear", image: "/images/product_cargo_pants.png", badge: null },
  { id: 4, name: "Indigo Denim Jacket", price: "₹3,499", category: "Outerwear", image: "/images/product_denim_jacket.png", badge: "Trending" },
  { id: 5, name: "Ivory Classic Sneakers", price: "₹2,799", category: "Footwear", image: "/images/product_white_sneakers.png", badge: null },
  { id: 6, name: "Ember Suede Bomber", price: "₹4,999", category: "Outerwear", image: "/images/product_brown_jacket.png", badge: "Premium" },
];

const CATEGORIES = ["T-Shirts", "Shirts", "Outerwear", "Bottomwear", "Footwear", "Accessories"];

const MARQUEE_TEXT = "SUMMER SALE — UP TO 40% OFF  ✦  FREE SHIPPING ON ₹999+  ✦  NEW ARRIVALS EVERY FRIDAY  ✦  ";

const TESTIMONIALS = [
  { name: "Arjun M.", text: "The quality is insane for the price. Clothix is my go-to now.", rating: 5 },
  { name: "Priya S.", text: "Minimal, clean designs that actually fit well. Finally a brand that gets it.", rating: 5 },
  { name: "Rohit K.", text: "Ordered the Denim Jacket — got compliments on day one. 10/10.", rating: 5 },
];

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
    }, { threshold: 0.15, ...options });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, isInView];
};

/* ─── Sub-components ─── */
const ProductCard = ({ product, index }) => {
  const [ref, isInView] = useInView();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      ref={ref}
      className={`group relative bg-neutral-900/60 rounded-2xl border border-neutral-800/40 overflow-hidden transition-all duration-500 hover:border-yellow-500/30 hover:shadow-[0_0_30px_rgba(234,179,8,0.08)] ${isInView ? 'animate-fade-in-up' : 'opacity-0'}`}
      style={{ animationDelay: `${index * 0.1}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badge */}
      {product.badge && (
        <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-yellow-500 text-neutral-950 text-xs font-bold rounded-full uppercase tracking-wider">
          {product.badge}
        </div>
      )}

      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-neutral-950/50">
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
        />
        <div className={`absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>

        {/* Quick Action */}
        <div className={`absolute bottom-4 left-4 right-4 transition-all duration-400 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <button className="w-full py-3 bg-yellow-500 text-neutral-950 font-bold text-sm rounded-xl hover:bg-yellow-400 transition active:scale-[0.97]">
            Quick View
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <p className="text-xs text-yellow-500/70 font-medium uppercase tracking-widest mb-1">{product.category}</p>
        <h3 className="text-base font-semibold text-neutral-100 mb-2">{product.name}</h3>
        <p className="text-lg font-bold text-white">{product.price}</p>
      </div>
    </div>
  );
};

const StatItem = ({ value, label, delay }) => {
  const [ref, isInView] = useInView();
  return (
    <div ref={ref} className={`text-center ${isInView ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: delay }}>
      <p className="text-3xl md:text-4xl font-extrabold text-yellow-500">{value}</p>
      <p className="text-sm text-neutral-400 mt-1">{label}</p>
    </div>
  );
};

/* ─── Main Landing Component ─── */
const Landing = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [heroRef, heroInView] = useInView();
  const [categoryRef, categoryInView] = useInView();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 font-sans relative overflow-hidden">

      {/* ═══ Announcement Marquee ═══ */}
      <div className="bg-yellow-500 text-neutral-950 py-2 overflow-hidden whitespace-nowrap">
        <div className="animate-marquee inline-flex">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="text-xs font-bold tracking-widest uppercase mx-4">{MARQUEE_TEXT}</span>
          ))}
        </div>
      </div>

      {/* ═══ Navigation ═══ */}
      <nav className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <ShoppingBag className="text-yellow-500" size={24} />
            <span className="text-xl font-extrabold text-yellow-500 tracking-widest uppercase">CLOTHIX</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
            <a href="#products" className="hover:text-yellow-500 transition">Shop</a>
            <a href="#categories" className="hover:text-yellow-500 transition">Categories</a>
            <a href="#testimonials" className="hover:text-yellow-500 transition">Reviews</a>
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
              <a href="#products" onClick={() => setMobileMenuOpen(false)} className="block text-neutral-300 font-medium hover:text-yellow-500 transition">Shop</a>
              <a href="#categories" onClick={() => setMobileMenuOpen(false)} className="block text-neutral-300 font-medium hover:text-yellow-500 transition">Categories</a>
              <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="block text-neutral-300 font-medium hover:text-yellow-500 transition">Reviews</a>
              <hr className="border-neutral-800" />
              <Link to="/login" className="block text-neutral-300 font-medium hover:text-yellow-400 transition">Login</Link>
              <Link to="/register" className="block text-center py-3 bg-yellow-500 text-neutral-950 font-bold rounded-full hover:bg-yellow-400 transition">Sign Up</Link>
            </div>
          </div>
        )}
      </nav>

      {/* ═══ Hero Section ═══ */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-yellow-500/5 blur-[150px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 w-full grid md:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left — Copy */}
          <div className={heroInView ? 'animate-slide-in-left' : 'opacity-0'}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900 border border-neutral-800 text-yellow-500 text-sm font-medium mb-8">
              <Sparkles size={16} />
              <span>Summer '26 Collection Out Now</span>
            </div>

            <h2 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1] mb-6">
              Redefine Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-200">
                Everyday Style
              </span>
            </h2>

            <p className="text-lg md:text-xl text-neutral-400 font-light max-w-lg mb-10 leading-relaxed">
              Premium, minimalist clothing designed for the modern trendsetter. Seamlessly blend comfort with aesthetics.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register" className="px-8 py-4 bg-yellow-500 text-neutral-950 font-bold text-lg rounded-full flex items-center justify-center gap-2 hover:bg-yellow-400 hover:shadow-[0_0_25px_rgba(234,179,8,0.4)] transition-all transform hover:-translate-y-1 animate-pulse-glow">
                Start Shopping <ArrowRight size={20} />
              </Link>
              <a href="#products" className="px-8 py-4 bg-transparent border border-neutral-700 text-neutral-200 font-bold text-lg rounded-full flex items-center justify-center hover:border-yellow-500 hover:text-yellow-500 transition-all">
                Explore Collection
              </a>
            </div>
          </div>

          {/* Right — Hero Image */}
          <div className={`relative ${heroInView ? 'animate-slide-in-right delay-200' : 'opacity-0'}`}>
            <div className="relative rounded-3xl overflow-hidden aspect-[3/4] max-h-[600px] animate-float">
              <img src="/images/hero_fashion.png" alt="CLOTHIX Style" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 via-transparent to-transparent"></div>
            </div>
            {/* Floating price tag */}
            <div className="absolute -bottom-4 -left-4 bg-neutral-900 border border-neutral-800 rounded-2xl px-5 py-3 shadow-xl animate-fade-in-up delay-600">
              <p className="text-xs text-neutral-400">Starting at</p>
              <p className="text-xl font-bold text-yellow-500">₹999</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Stats Bar ═══ */}
      <section className="py-16 border-y border-neutral-800/50">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatItem value="50K+" label="Happy Customers" delay="0s" />
          <StatItem value="200+" label="Unique Styles" delay="0.1s" />
          <StatItem value="4.9★" label="Avg. Rating" delay="0.2s" />
          <StatItem value="10+" label="Cities Shipped" delay="0.3s" />
        </div>
      </section>

      {/* ═══ Categories Grid ═══ */}
      <section id="categories" ref={categoryRef} className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className={`text-center mb-16 ${categoryInView ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <p className="text-yellow-500 text-sm font-bold uppercase tracking-widest mb-3">Browse</p>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white">Shop by Category</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((cat, i) => (
              <div
                key={cat}
                className={`group relative bg-neutral-900/50 border border-neutral-800/40 rounded-2xl p-6 text-center cursor-pointer hover:border-yellow-500/40 hover:bg-neutral-900/80 transition-all duration-300 hover:-translate-y-1 ${categoryInView ? 'animate-scale-in' : 'opacity-0'}`}
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <p className="text-sm font-semibold text-neutral-300 group-hover:text-yellow-500 transition">{cat}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Featured Products ═══ */}
      <section id="products" className="py-24 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
            <div>
              <p className="text-yellow-500 text-sm font-bold uppercase tracking-widest mb-3">Curated</p>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white">Trending Now</h2>
            </div>
            <a href="#" className="flex items-center gap-1 text-yellow-500 font-medium hover:gap-3 transition-all">
              View All <ChevronRight size={18} />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCTS.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Perks Strip ═══ */}
      <section className="py-16 border-y border-neutral-800/50 bg-neutral-900/30">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: <Truck size={28} />, title: "Free Shipping", desc: "On orders above ₹999" },
            { icon: <Shield size={28} />, title: "Secure Checkout", desc: "100% encrypted payments" },
            { icon: <RefreshCw size={28} />, title: "Easy Returns", desc: "15-day hassle-free returns" },
            { icon: <Star size={28} />, title: "Premium Quality", desc: "Crafted with finest fabrics" },
          ].map((perk, i) => (
            <div key={i} className="flex items-start gap-4 group">
              <div className="p-3 bg-neutral-800/50 rounded-xl text-yellow-500 group-hover:bg-yellow-500/10 transition">
                {perk.icon}
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">{perk.title}</h4>
                <p className="text-neutral-500 text-sm mt-0.5">{perk.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ Testimonials ═══ */}
      <section id="testimonials" className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-yellow-500 text-sm font-bold uppercase tracking-widest mb-3">Loved by thousands</p>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white">What Our Customers Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => {
              const [ref, isInView] = useInView();
              return (
                <div
                  ref={ref}
                  key={i}
                  className={`bg-neutral-900/60 border border-neutral-800/40 rounded-2xl p-8 hover:border-yellow-500/20 transition-all duration-300 ${isInView ? 'animate-fade-in-up' : 'opacity-0'}`}
                  style={{ animationDelay: `${i * 0.15}s` }}
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} size={16} className="fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  <p className="text-neutral-300 text-sm leading-relaxed mb-6">"{t.text}"</p>
                  <p className="text-yellow-500 font-semibold text-sm">{t.name}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ CTA Banner ═══ */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-transparent to-yellow-500/5 pointer-events-none"></div>
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
            Ready to Elevate Your <span className="text-yellow-500">Wardrobe</span>?
          </h2>
          <p className="text-neutral-400 text-lg mb-10 font-light">
            Join 50,000+ people who trust CLOTHIX for everyday premium fashion.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="px-10 py-4 bg-yellow-500 text-neutral-950 font-bold text-lg rounded-full hover:bg-yellow-400 hover:shadow-[0_0_25px_rgba(234,179,8,0.4)] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2">
              Create Account <ArrowRight size={20} />
            </Link>
            <Link to="/login" className="px-10 py-4 border border-neutral-700 text-neutral-200 font-bold text-lg rounded-full hover:border-yellow-500 hover:text-yellow-500 transition-all flex items-center justify-center">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ Footer ═══ */}
      <footer className="border-t border-neutral-800/50 bg-neutral-950 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag className="text-yellow-500" size={22} />
                <span className="text-lg font-extrabold text-yellow-500 tracking-widest uppercase">CLOTHIX</span>
              </div>
              <p className="text-neutral-500 text-sm leading-relaxed">
                Premium minimalist fashion for the modern generation. Redefining everyday style.
              </p>
            </div>

            {/* Links */}
            {[
              { title: "Shop", links: ["New Arrivals", "Bestsellers", "Sale", "Collections"] },
              { title: "Help", links: ["FAQs", "Shipping", "Returns", "Size Guide"] },
              { title: "Company", links: ["About Us", "Careers", "Contact", "Press"] },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="text-white font-semibold text-sm mb-4">{col.title}</h4>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-neutral-500 text-sm hover:text-yellow-500 transition">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-neutral-800/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-neutral-600 text-sm">© 2026 CLOTHIX. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-neutral-600 text-sm hover:text-yellow-500 transition">Privacy</a>
              <a href="#" className="text-neutral-600 text-sm hover:text-yellow-500 transition">Terms</a>
              <a href="#" className="text-neutral-600 text-sm hover:text-yellow-500 transition">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
