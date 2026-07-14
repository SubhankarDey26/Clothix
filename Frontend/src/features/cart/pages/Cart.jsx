import React, { useEffect } from 'react';
import { useCart } from '../hooks/useCart';
import { Link } from 'react-router';
import { ShoppingBag, ArrowLeft, Trash2, ShoppingCart, Plus, Minus } from 'lucide-react';
import Nav from "../../shared/components/Nav.jsx";

const CURRENCY_SYMBOLS = { INR: '₹', USD: '$', EUR: '€', GBP: '£', JPY: '¥' };

const Cart = () => {
    const { items, totalPrice: backendTotalPrice, loading, error, handleGetCart, handleUpdateQuantity, handleRemoveItem } = useCart();

    useEffect(() => {
        handleGetCart();
    }, []);

    // Calculate Subtotal (Fallback)
    const calculateSubtotal = () => {
        if (!items || items.length === 0) return 0;
        return items.reduce((total, item) => {
            const prod = item.product;
            if (!prod) return total;
            const variantId = item.variant;
            const variant = prod.variants?.find(v => v._id === variantId);
            const currentPriceObj = variant?.price?.amount ? variant.price : prod.price;
            const currentPrice = currentPriceObj?.amount || 0;
            return total + (currentPrice * item.quantity);
        }, 0);
    };

    const subtotal = backendTotalPrice !== undefined && backendTotalPrice !== 0 ? backendTotalPrice : calculateSubtotal();
    const shippingEstimate = subtotal > 999 || subtotal === 0 ? 0 : 99;
    const total = subtotal + shippingEstimate;

    // Use a common currency symbol if available
    const currency = items && items.length > 0 ? (items[0].price?.currency || 'INR') : 'INR';
    const currencySymbol = CURRENCY_SYMBOLS[currency] || currency;

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-200 font-sans flex flex-col">
            
            {/* ═══ Navigation ═══ */}
            <Nav showHomeShop={false} />

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

                                const currentPriceObj = variant?.price?.amount ? variant.price : prod.price;
                                const currentPrice = currentPriceObj?.amount || 0;
                                const addedPrice = item.price?.amount || 0;
                                const priceDiff = addedPrice - currentPrice;
                                const hasPriceChanged = addedPrice > 0 && priceDiff !== 0;

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
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-3">
                                                        <p className="text-xl font-bold text-yellow-500">
                                                            {CURRENCY_SYMBOLS[currentPriceObj?.currency || 'INR'] || currentPriceObj?.currency}{currentPrice}
                                                        </p>
                                                        {hasPriceChanged && (
                                                            <p className="text-sm text-neutral-500 line-through">
                                                                {CURRENCY_SYMBOLS[item.price?.currency || 'INR'] || item.price?.currency}{addedPrice}
                                                            </p>
                                                        )}
                                                    </div>
                                                    {hasPriceChanged && priceDiff > 0 && (
                                                        <p className="text-sm font-medium text-green-500 mt-1">
                                                            you will get this product on {currentPrice} save {priceDiff}
                                                        </p>
                                                    )}
                                                    {hasPriceChanged && priceDiff < 0 && (
                                                        <p className="text-sm font-medium text-red-500 mt-1">
                                                            Warning this Product will cost you {-priceDiff} More
                                                        </p>
                                                    )}
                                                </div>
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
