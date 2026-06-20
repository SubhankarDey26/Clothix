import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router';
import { ShoppingBag, LayoutGrid, PlusCircle, LogOut } from 'lucide-react';
import CreateProduct from './CreateProduct';
import MyProducts from './MyProducts';

const TABS = [
  { id: 'products', label: 'My Products', icon: <LayoutGrid size={18} /> },
  { id: 'create', label: 'Add Product', icon: <PlusCircle size={18} /> },
];

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const { user } = useSelector((state) => state.auth);

  const handleProductCreated = () => {
    // Switch back to products tab after successful creation
    setActiveTab('products');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 font-sans">

      {/* ═══ Top Nav ═══ */}
      <nav className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-800/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <ShoppingBag className="text-yellow-500" size={22} />
            <span className="text-lg font-extrabold text-yellow-500 tracking-widest uppercase">CLOTHIX</span>
          </Link>

          <div className="flex items-center gap-4">
            {/* Seller badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              <span className="text-xs font-medium text-yellow-500">Seller</span>
            </div>

            {/* User name */}
            <p className="text-sm text-neutral-400 hidden sm:block">
              {user?.fullname || 'Seller'}
            </p>

            {/* Back to store */}
            <Link
              to="/home"
              className="p-2 text-neutral-500 hover:text-neutral-300 transition"
              title="Back to store"
            >
              <LogOut size={18} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══ Main Content ═══ */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">

        {/* ─── Page Header ─── */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Seller Dashboard</h1>
          <p className="text-neutral-500 text-sm mt-2">Manage your listings and add new products.</p>
        </div>

        {/* ─── Tab Navigation ─── */}
        <div className="flex gap-2 mb-10 p-1.5 bg-neutral-900/60 rounded-2xl border border-neutral-800/40 w-fit">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300
                ${activeTab === tab.id
                  ? 'bg-yellow-500 text-neutral-950 shadow-[0_0_15px_rgba(234,179,8,0.2)]'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
                }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ─── Tab Content ─── */}
        <div className="min-h-[50vh]">
          {activeTab === 'products' && <MyProducts />}

          {activeTab === 'create' && (
            <div className="w-full">
              <CreateProduct onSuccess={handleProductCreated} />
            </div>
          )}
        </div>
      </div>

      {/* ═══ Footer ═══ */}
      <div className="border-t border-neutral-900 mt-16 py-8 text-center">
        <p className="text-neutral-700 text-sm">© 2026 CLOTHIX Seller Portal</p>
      </div>
    </div>
  );
};

export default SellerDashboard;
