import { ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';
import { Link } from 'react-router';

const Landing = () => {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 font-sans flex flex-col relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-yellow-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Navigation */}
      <nav className="w-full p-6 flex justify-between items-center relative z-10 max-w-7xl mx-auto">
        <h1 className="text-2xl font-extrabold text-yellow-500 tracking-widest uppercase flex items-center gap-2">
          <ShoppingBag className="text-yellow-500" />
          CLOTHIX
        </h1>
        <div className="flex gap-4">
          <Link to="/login" className="px-5 py-2 text-neutral-300 font-medium hover:text-yellow-400 transition">
            Login
          </Link>
          <Link to="/register" className="px-5 py-2 bg-yellow-500 text-neutral-950 font-semibold rounded-full hover:bg-yellow-400 hover:shadow-[0_0_15px_rgba(234,179,8,0.3)] transition-all">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center p-6 relative z-10 max-w-4xl mx-auto mt-12 md:mt-0">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900 border border-neutral-800 text-yellow-500 text-sm font-medium mb-8">
          <Sparkles size={16} />
          <span>New Summer Collection Out Now</span>
        </div>
        
        <h2 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
          Redefine Your <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-200">
            Everyday Style
          </span>
        </h2>
        
        <p className="text-lg md:text-xl text-neutral-400 font-light max-w-2xl mb-12">
          Discover premium, minimalist clothing designed for the modern trendsetter. Seamlessly blend comfort with aesthetics.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link to="/register" className="px-8 py-4 bg-yellow-500 text-neutral-950 font-bold text-lg rounded-full flex items-center justify-center gap-2 hover:bg-yellow-400 hover:shadow-[0_0_20px_rgba(234,179,8,0.4)] transition-all transform hover:-translate-y-1">
            Start Shopping <ArrowRight size={20} />
          </Link>
          <Link to="/login" className="px-8 py-4 bg-transparent border border-neutral-700 text-neutral-200 font-bold text-lg rounded-full flex items-center justify-center hover:border-yellow-500 hover:text-yellow-500 transition-all">
            View Collection
          </Link>
        </div>
      </main>

      {/* Decorative footer elements */}
      <div className="h-32 w-full border-t border-neutral-900 mt-auto flex items-center justify-center">
        <p className="text-neutral-600 text-sm">© 2026 CLOTHIX. Elevating Essentials.</p>
      </div>
    </div>
  );
};

export default Landing;
