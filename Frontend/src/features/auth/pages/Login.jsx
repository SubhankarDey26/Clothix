import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hook/useAuth.js';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import ContinueWithGoogle from '../components/ContinueWithGoogle';

const Login = () => {

  const navigate=useNavigate()
  const user=useSelector((state)=>state.auth.user)

  const {handleLogin} = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission with login
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleLogin({
        email: formData.email,
        password: formData.password
      });
      // Navigate based on user role after successful login
      if(user?.role === 'seller'){
        navigate("/seller")
      } else {
        navigate("/home")
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-xl bg-neutral-900/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-neutral-800/50">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-500 tracking-widest mb-3 uppercase">CLOTHIX</h1>
          <p className="text-neutral-400 text-sm md:text-base tracking-wide font-light">Welcome back to the revolution.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300 ml-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="w-full bg-neutral-950/50 border border-neutral-800 text-neutral-100 rounded-2xl px-5 py-4 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition duration-300 placeholder-neutral-600"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-medium text-neutral-300">Password</label>
              <a href="#" className="text-sm text-yellow-500 hover:text-yellow-400 transition">Forgot password?</a>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-neutral-950/50 border border-neutral-800 text-neutral-100 rounded-2xl px-5 py-4 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition duration-300 placeholder-neutral-600 pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 text-neutral-950 font-bold text-lg rounded-2xl px-4 py-4 mt-8 hover:bg-yellow-400 hover:shadow-[0_0_20px_rgba(234,179,8,0.3)] focus:outline-none focus:ring-4 focus:ring-yellow-500/50 transition-all duration-300 transform active:scale-[0.98]"
          >
            Sign In
          </button>
        </form>

        <ContinueWithGoogle />

        <p className="text-center text-sm text-neutral-500 mt-10">
          Don't have an account? <a href="/register" className="text-yellow-500 font-medium hover:text-yellow-400 transition ml-1">Create one</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
