import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import {useAuth} from "../hook/useAuth.js"
import { useNavigate } from 'react-router';

const Register = () => {

const {handleRegister}=useAuth()
const navigate=useNavigate()

  const [formData, setFormData] = useState({
    fullName: '',
    contactNumber: '',
    email: '',
    password: '',
    isSeller: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    // Pass form data with correct parameter names (fullname not fullName)
    await handleRegister({
        email:formData.email,
        contact:formData.contactNumber,
        fullname:formData.fullName, // Convert fullName to fullname for backend
        password:formData.password,
        isSeller:formData.isSeller
    })
    navigate("/home")
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-xl bg-neutral-900/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-neutral-800/50">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-500 tracking-widest mb-3 uppercase">CLOTHIX</h1>
          <p className="text-neutral-400 text-sm md:text-base tracking-wide font-light">Join the revolution in fashion.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300 ml-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full bg-neutral-950/50 border border-neutral-800 text-neutral-100 rounded-2xl px-5 py-4 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition duration-300 placeholder-neutral-600"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300 ml-1">Contact Number</label>
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="+1 (234) 567-890"
              className="w-full bg-neutral-950/50 border border-neutral-800 text-neutral-100 rounded-2xl px-5 py-4 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition duration-300 placeholder-neutral-600"
              required
            />
          </div>

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
            <label className="text-sm font-medium text-neutral-300 ml-1">Password</label>
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

          <div className="flex items-center mt-6 p-4 rounded-2xl bg-neutral-950/30 border border-neutral-800/50 cursor-pointer hover:border-neutral-700 transition">
            <input
              type="checkbox"
              id="isSeller"
              name="isSeller"
              checked={formData.isSeller}
              onChange={handleChange}
              className="w-5 h-5 bg-neutral-950 border-neutral-700 rounded text-yellow-500 focus:ring-yellow-500 focus:ring-offset-neutral-900 focus:ring-offset-2 accent-yellow-500 cursor-pointer"
            />
            <label htmlFor="isSeller" className="ml-4 text-sm font-medium text-neutral-200 cursor-pointer flex-1">
              Register as a Seller
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 text-neutral-950 font-bold text-lg rounded-2xl px-4 py-4 mt-8 hover:bg-yellow-400 hover:shadow-[0_0_20px_rgba(234,179,8,0.3)] focus:outline-none focus:ring-4 focus:ring-yellow-500/50 transition-all duration-300 transform active:scale-[0.98]"
          >
            Create Account
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-8">
          <div className="flex-1 h-px bg-neutral-800"></div>
          <span className="px-4 text-xs text-neutral-500 uppercase tracking-widest font-medium">or</span>
          <div className="flex-1 h-px bg-neutral-800"></div>
        </div>

        {/* Google OAuth Button */}
        <a
          href="/api/auth/google"
          className="w-full flex items-center justify-center gap-3 bg-white text-neutral-800 font-semibold text-base rounded-2xl px-4 py-4 hover:bg-neutral-100 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] focus:outline-none focus:ring-4 focus:ring-white/20 transition-all duration-300 transform active:scale-[0.98]"
          style={{ textDecoration: 'none' }}
        >
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.0 24.0 0 0 0 0 21.56l7.98-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Continue with Google
        </a>

        <p className="text-center text-sm text-neutral-500 mt-10">
          Already have an account? <a href="/login" className="text-yellow-500 font-medium hover:text-yellow-400 transition ml-1">Sign In</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
