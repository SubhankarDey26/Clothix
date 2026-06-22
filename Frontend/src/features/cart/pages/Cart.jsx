import React, { useEffect, useState } from 'react';
import { useCart } from '../hooks/useCart';
import { useSelector } from 'react-redux';
import { Link } from 'react-router';
import { ShoppingBag, ArrowLeft, Trash2, ShoppingCart, LogOut, Menu, X, Plus, Minus } from 'lucide-react';
import { useAuth } from '../../auth/hook/useAuth.js';

const CURRENCY_SYMBOLS = { INR: '₹', USD: '$', EUR: '€', GBP: '£', JPY: '¥' };

const Cart = () => {
    const { items, loading, error, handleGetCart, handleUpdateQuantity, handleRemoveItem } = useCart();
    const { handleLogout } = useAuth();
    const { user } = useSelector((state) => state.auth);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        handleGetCart();
    }, []);

    // Calculate Subtotal
    const calculateSubtotal = () => {
        if (!items || items.length === 0) return 0;
        return items.reduce((total, item) => {
            const price = item.price?.amount || 0;
            return total + (price * item.quantity);
        }, 0);
    };

    const subtotal = calculateSubtotal();
    const shippingEstimate = subtotal > 999 || subtotal === 0 ? 0 : 99;
    const total = subtotal + shippingEstimate;

    // Use a common currency symbol if available
    const currency = items && items.length > 0 ? (items[0].price?.currency || 'INR') : 'INR';
    const currencySymbol = CURRENCY_SYMBOLS[currency] || currency;

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-200 font-sans flex flex-col">
            
            {/* ═══ Navigation ═══ */}
            <nav className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-800/50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <Link to={user ? "/buyer" : "/"} className="flex items-center gap-2">
                        <ShoppingBag className="text-yellow-500" size={24} />
                        <span className="text-xl font-extrabold text-yellow-500 tracking-widest uppercase">CLOTHIX</span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
                        <Link to="/" className="hover:text-yellow-500 transition">Home</Link>
                        <Link to="/buyer" className="hover:text-yellow-500 transition">Shop</Link>
                    </div>

                    {/* Desktop Auth */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link to="/cart" className="relative p-2 text-yellow-500 transition group">
                            <ShoppingCart size={22} className="group-hover:scale-110 transition-transform" />
                            {items && items.length > 0 && (
                                <span className="absolute top-0 right-0 w-4 h-4 bg-yellow-500 text-neutral-950 text-[10px] font-bold flex items-center justify-center rounded-full">
                                    {items.length}
                                </span>
                            )}
                        </Link>
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
                            <hr className="border-neutral-800" />
                            <Link to="/cart" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-yellow-500 font-medium transition">
                                <ShoppingCart size={20} /> Cart {items && items.length > 0 && `(${items.length})`}
                            </Link>
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

            <main className="flex-grow max-w-7xl mx-auto px-6 py-12 w-full">
                
                <div className="flex items-center gap-4 mb-10">
                    <Link to="/buyer" className="text-neutral-500 hover:text-yellow-500 transition-colors p-2 rounded-full hover:bg-neutral-900">
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="text-4xl font-extrabold text-white tracking-tight">Your Cart</h1>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-4">
                        <div className="w-10 h-10 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-neutral-500 text-sm">Loading cart…</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-10 text-center max-w-md mx-auto">
                        <p className="text-red-400 text-sm mb-4">{error}</p>
                        <button onClick={handleGetCart} className="px-6 py-2.5 text-sm font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl transition">
                            Retry
                        </button>
                    </div>
                ) : !items || items.length === 0 ? (
                    <div className="text-center py-20 bg-neutral-900/40 rounded-3xl border border-neutral-800/50">
                        <ShoppingCart size={64} className="mx-auto text-neutral-700 mb-6" />
                        <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
                        <p className="text-neutral-500 mb-8">Looks like you haven't added anything yet.</p>
                        <Link to="/buyer" className="inline-block px-8 py-4 bg-yellow-500 text-neutral-950 font-bold text-lg rounded-full hover:bg-yellow-400 hover:shadow-[0_0_20px_rgba(234,179,8,0.3)] transition-all">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-6">
                            {items.map((item, index) => {
                                const prod = item.product;
                                if (!prod) return null;

                                const variantId = item.variant;
                                const variant = prod.variants?.find(v => v._id === variantId);
                                
                                const imageSrc = (variant?.images && variant.images.length > 0) 
                                    ? variant.images[0].url 
                                    : (prod.image && prod.image.length > 0) ? prod.image[0].url : '';

                                let variantDesc = "";
                                if (variant?.attributes) {
                                    variantDesc = Object.entries(variant.attributes).map(([k,v]) => `${k}: ${v}`).join(' | ');
                                }

                                return (
                                    <div key={index} className="flex gap-6 p-6 bg-neutral-900/60 border border-neutral-800/60 rounded-3xl">
                                        {/* Image */}
                                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-neutral-800 flex-shrink-0">
                                            {imageSrc ? (
                                                <img src={imageSrc} alt={prod.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <ShoppingBag className="text-neutral-600" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="flex-grow flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start">
                                                    <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{prod.title}</h3>
                                                </div>
                                                {variantDesc && (
                                                    <p className="text-sm text-neutral-500 mb-2">{variantDesc}</p>
                                                )}
                                                <p className="text-xl font-bold text-yellow-500">
                                                    {CURRENCY_SYMBOLS[item.price?.currency || 'INR'] || item.price?.currency}{item.price?.amount || 0}
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between mt-4">
                                                <div className="flex items-center gap-2 bg-neutral-800/80 rounded-xl p-1">
                                                    <button 
                                                        onClick={async () => {
                                                            try {
                                                                await handleUpdateQuantity(prod._id, variantId, item.quantity - 1);
                                                            } catch (err) {
                                                                alert(err.response?.data?.message || err.message || 'Failed to update quantity');
                                                            }
                                                        }}
                                                        disabled={loading}
                                                        className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-lg transition"
                                                    >
                                                        <Minus size={16} />
                                                    </button>
                                                    <span className="w-8 text-center font-bold text-white text-sm">{item.quantity}</span>
                                                    <button 
                                                        onClick={async () => {
                                                            try {
                                                                await handleUpdateQuantity(prod._id, variantId, item.quantity + 1);
                                                            } catch (err) {
                                                                alert('Cannot add more. Requested quantity exceeds available seller stock.');
                                                            }
                                                        }}
                                                        disabled={loading}
                                                        className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-lg transition"
                                                    >
                                                        <Plus size={16} />
                                                    </button>
                                                </div>

                                                <button 
                                                    onClick={async () => {
                                                        try {
                                                            await handleRemoveItem(prod._id, variantId);
                                                        } catch (err) {
                                                            alert('Failed to remove item');
                                                        }
                                                    }}
                                                    disabled={loading}
                                                    className="p-2 text-neutral-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-neutral-900/60 border border-neutral-800/60 rounded-3xl p-6 md:p-8 sticky top-28">
                                <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">Order Summary</h2>
                                
                                <div className="space-y-4 text-sm mb-6 border-b border-neutral-800/50 pb-6">
                                    <div className="flex justify-between text-neutral-400">
                                        <span>Subtotal</span>
                                        <span className="text-white font-medium">{currencySymbol}{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-neutral-400">
                                        <span>Estimated Shipping</span>
                                        <span className="text-white font-medium">{shippingEstimate === 0 ? 'Free' : `${currencySymbol}${shippingEstimate.toFixed(2)}`}</span>
                                    </div>
                                </div>
                                
                                <div className="flex justify-between items-center mb-8">
                                    <span className="text-lg font-bold text-white">Total</span>
                                    <span className="text-2xl font-black text-yellow-500">{currencySymbol}{total.toFixed(2)}</span>
                                </div>
                                
                                <button className="w-full py-4 bg-yellow-500 text-neutral-950 font-bold text-lg rounded-2xl hover:bg-yellow-400 hover:shadow-[0_0_20px_rgba(234,179,8,0.3)] transition-all transform active:scale-[0.98]">
                                    Proceed to Checkout
                                </button>

                                <div className="mt-4 text-center">
                                    <p className="text-xs text-neutral-500">Taxes calculated at checkout</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <footer className="border-t border-neutral-900 py-8 text-center bg-neutral-950 mt-auto">
                <p className="text-neutral-700 text-sm">© 2026 CLOTHIX</p>
            </footer>
        </div>
    );
};

export default Cart;
