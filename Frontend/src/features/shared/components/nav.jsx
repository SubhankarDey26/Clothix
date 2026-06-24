import { useState } from 'react';
import { Link } from 'react-router';
import { useSelector } from 'react-redux';
import { ShoppingBag, ShoppingCart, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../auth/hook/useAuth.js';

/**
 * Shared Navbar component used across all pages.
 *
 * Props:
 *  - showHomeShop {boolean} — if false, hides the "Home" and "Shop" nav links (used on ProductDetail, Cart pages)
 */
const Nav = ({ showHomeShop = true }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const { handleLogout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-800/50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link to={user ? '/buyer' : '/'} className="flex items-center gap-2">
          <ShoppingBag className="text-yellow-500" size={24} />
          <span className="text-xl font-extrabold text-yellow-500 tracking-widest uppercase">CLOTHIX</span>
        </Link>

        {/* Desktop Nav Links */}
        {showHomeShop && (
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
            <Link to="/" className="hover:text-yellow-500 transition">Home</Link>
            <Link to="/buyer" className="hover:text-yellow-500 transition">Shop</Link>
            {user?.role === 'seller' && (
              <Link to="/seller" className="hover:text-yellow-500 transition">Seller Dashboard</Link>
            )}
          </div>
        )}

        {/* Desktop Right — Cart + Auth */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/cart" className="relative p-2 text-neutral-300 hover:text-yellow-500 transition group">
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

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-neutral-300 hover:text-yellow-500 transition"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-neutral-900/95 backdrop-blur-xl border-t border-neutral-800/50 animate-fade-in">
          <div className="px-6 py-6 space-y-4">
            {showHomeShop && (
              <>
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block text-neutral-300 font-medium hover:text-yellow-500 transition">Home</Link>
                <Link to="/buyer" onClick={() => setMobileMenuOpen(false)} className="block text-neutral-300 font-medium hover:text-yellow-500 transition">Shop</Link>
                {user?.role === 'seller' && (
                  <Link to="/seller" onClick={() => setMobileMenuOpen(false)} className="block text-neutral-300 font-medium hover:text-yellow-500 transition">Seller Dashboard</Link>
                )}
              </>
            )}
            <hr className="border-neutral-800" />
            <Link to="/cart" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-neutral-300 font-medium hover:text-yellow-500 transition">
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
  );
};

export default Nav;