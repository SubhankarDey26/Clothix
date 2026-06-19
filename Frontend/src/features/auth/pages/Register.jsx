import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from "../hook/useAuth.js";
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import ContinueWithGoogle from '../components/ContinueWithGoogle';
import Toast from '../components/Toast';

/* ─── Validation Rules (mirroring backend express-validator rules) ─── */
const validate = {
  fullName: (v) => {
    if (!v.trim()) return 'Full name is required';
    if (v.trim().length < 2) return 'Full name must be at least 2 characters long';
    return '';
  },
  contactNumber: (v) => {
    if (!v.trim()) return 'Contact number is required';
    const digits = v.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 15) return 'Contact must contain 10–15 digits';
    return '';
  },
  email: (v) => {
    if (!v.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Please enter a valid email address';
    return '';
  },
  password: (v) => {
    if (!v) return 'Password is required';
    if (v.length < 6) return 'Password must be at least 6 characters long';
    return '';
  },
};

const Register = () => {
  const { handleRegister } = useAuth();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    fullName: '',
    contactNumber: '',
    email: '',
    password: '',
    isSeller: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [toast, setToast] = useState(null); // { message, type }

  /* ─── Change & Blur ─── */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));

    // Live-validate on change only if field was already touched
    if (touched[name] && validate[name]) {
      setErrors((prev) => ({ ...prev, [name]: validate[name](value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (validate[name]) {
      setErrors((prev) => ({ ...prev, [name]: validate[name](value) }));
    }
  };

  /* ─── Submit ─── */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    Object.keys(validate).forEach((key) => {
      const err = validate[key](formData[key]);
      if (err) newErrors[key] = err;
    });
    setErrors(newErrors);
    setTouched({ fullName: true, contactNumber: true, email: true, password: true });

    if (Object.keys(newErrors).length > 0) return;

    try {
      const data = await handleRegister({
        email: formData.email,
        contact: formData.contactNumber,
        fullname: formData.fullName,
        password: formData.password,
        isSeller: formData.isSeller,
      });

      setToast({ message: 'Registered successfully! Redirecting…', type: 'success' });

      setTimeout(() => {
        if (data.user?.role === 'seller') {
          navigate('/seller');
        } else {
          navigate('/home');
        }
      }, 1500);
    } catch (error) {
      const msg =
        Array.isArray(error.response?.data?.errors)
          ? error.response.data.errors.map((e) => e.msg).join(', ')
          : error.response?.data?.message || 'Registration failed. Please try again.';
      setToast({ message: msg, type: 'error' });
    }
  };

  /* ─── Helper: input border class ─── */
  const inputClass = (field) =>
    `w-full bg-neutral-950/50 border text-neutral-100 rounded-2xl px-5 py-4 focus:outline-none transition duration-300 placeholder-neutral-600 ${
      touched[field] && errors[field]
        ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
        : 'border-neutral-800 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500'
    }`;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 flex items-center justify-center p-6 font-sans">
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="w-full max-w-xl bg-neutral-900/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-neutral-800/50">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-500 tracking-widest mb-3 uppercase">CLOTHIX</h1>
          <p className="text-neutral-400 text-sm md:text-base tracking-wide font-light">Join the revolution in fashion.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* ── Full Name ── */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300 ml-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="John Doe"
              className={inputClass('fullName')}
            />
            {touched.fullName && errors.fullName && (
              <p className="text-red-500 text-xs ml-1 mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* ── Contact Number ── */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300 ml-1">Contact Number</label>
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="+91 98765 43210"
              className={inputClass('contactNumber')}
            />
            {touched.contactNumber && errors.contactNumber && (
              <p className="text-red-500 text-xs ml-1 mt-1">{errors.contactNumber}</p>
            )}
          </div>

          {/* ── Email Address ── */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300 ml-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="john@example.com"
              className={inputClass('email')}
            />
            {touched.email && errors.email && (
              <p className="text-red-500 text-xs ml-1 mt-1">{errors.email}</p>
            )}
          </div>

          {/* ── Password ── */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300 ml-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="••••••••"
                className={`${inputClass('password')} pr-12`}
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
            {touched.password && errors.password && (
              <p className="text-red-500 text-xs ml-1 mt-1">{errors.password}</p>
            )}
          </div>

          {/* ── Seller Checkbox ── */}
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

          {/* ── Submit ── */}
          <button
            type="submit"
            className="w-full bg-yellow-500 text-neutral-950 font-bold text-lg rounded-2xl px-4 py-4 mt-8 hover:bg-yellow-400 hover:shadow-[0_0_20px_rgba(234,179,8,0.3)] focus:outline-none focus:ring-4 focus:ring-yellow-500/50 transition-all duration-300 transform active:scale-[0.98]"
          >
            Create Account
          </button>
        </form>

        <ContinueWithGoogle />

        <p className="text-center text-sm text-neutral-500 mt-10">
          Already have an account? <a href="/login" className="text-yellow-500 font-medium hover:text-yellow-400 transition ml-1">Sign In</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
