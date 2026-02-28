"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, User, Phone, Mail, Lock, CheckCircle, AlertCircle } from "lucide-react";
import SystemLoading from "@/components/SystemLoading";
import Link from "next/link";
import { validateSignupForm } from "@/lib/validation";

export default function SignupPage() {
  const { signUp, user } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (user) {
      setIsRedirecting(true);
      router.push(user.is_business ? "/business/dashboard" : "/user/dashboard");
    }
  }, [user, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");
    
    // Validate form
    const validation = validateSignupForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    
    try {
      const result = await signUp(formData.email, formData.password, formData.phone, formData.name);
      
      if (result.success) {
        if (result.requiresConfirmation) {
          setSuccessMessage(result.message);
          // Clear form
          setFormData({
            name: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
          });
        }
      } else {
        setErrors({ general: result.message || "Failed to create account. Please try again." });
      }
    } catch (err) {
      setErrors({ general: err.message || "An unexpected error occurred." });
    } finally {
      setLoading(false);
    }
  };

  if (loading || isRedirecting) {
    return <SystemLoading />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center px-4 py-12 font-sans selection:bg-blue-600">
      
      {/* Logo Header */}
      <div className="mb-8">
        <div className="w-10 h-10 border-2 border-blue-600 flex items-center justify-center font-bold text-blue-600 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.1)]">
          Q
        </div>
      </div>

      <div className="w-full max-w-[400px]">
        <div className="mb-8 text-left">
          <h1 className="text-xl font-bold tracking-tight">Create Account</h1>
          <p className="text-zinc-500 text-sm mt-1">Join the QueueFlow network.</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 py-3 px-4 rounded-lg border border-green-500/20 bg-green-500/10 flex items-center gap-3">
            <CheckCircle className="text-green-500 flex-shrink-0" size={18} />
            <p className="text-green-400 text-sm font-medium">{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {errors.general && (
          <div className="mb-6 py-3 px-4 rounded-lg border border-red-500/20 bg-red-500/10 flex items-center gap-3">
            <AlertCircle className="text-red-500 flex-shrink-0" size={18} />
            <p className="text-red-400 text-sm font-medium">{errors.general}</p>
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">Full Name</label>
            <div className="relative group">
              <User className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${errors.name ? 'text-red-500' : 'text-zinc-600 group-focus-within:text-blue-500'}`} size={16} />
              <input
                type="text"
                name="name"
                required
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full bg-[#111111] border rounded-lg py-3 pl-10 pr-4 text-sm text-zinc-200 focus:outline-none transition-all placeholder:text-zinc-700 ${errors.name ? 'border-red-500' : 'border-zinc-800 focus:border-blue-600'}`}
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-[11px] ml-1">{errors.name}</p>
            )}
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">Phone</label>
            <div className="relative group">
              <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${errors.phone ? 'text-red-500' : 'text-zinc-600 group-focus-within:text-blue-500'}`} size={16} />
              <input
                type="tel"
                name="phone"
                required
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full bg-[#111111] border rounded-lg py-3 pl-10 pr-4 text-sm text-zinc-200 focus:outline-none transition-all placeholder:text-zinc-700 ${errors.phone ? 'border-red-500' : 'border-zinc-800 focus:border-blue-600'}`}
              />
            </div>
            {errors.phone && (
              <p className="text-red-500 text-[11px] ml-1">{errors.phone}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">Email Address</label>
            <div className="relative group">
              <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${errors.email ? 'text-red-500' : 'text-zinc-600 group-focus-within:text-blue-500'}`} size={16} />
              <input
                type="email"
                name="email"
                required
                placeholder="email@example.com"
                value={formData.email}
                onChange={handleChange}
                className={`w-full bg-[#111111] border rounded-lg py-3 pl-10 pr-4 text-sm text-zinc-200 focus:outline-none transition-all placeholder:text-zinc-700 ${errors.email ? 'border-red-500' : 'border-zinc-800 focus:border-blue-600'}`}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-[11px] ml-1">{errors.email}</p>
            )}
          </div>

          {/* Password Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">Password</label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full bg-[#111111] border rounded-lg py-3 px-4 text-sm text-zinc-200 focus:outline-none transition-all placeholder:text-zinc-700 ${errors.password ? 'border-red-500' : 'border-zinc-800 focus:border-blue-600'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-[11px] ml-1">{errors.password}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">Confirm</label>
              <div className="relative group">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  required
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full bg-[#111111] border rounded-lg py-3 px-4 text-sm text-zinc-200 focus:outline-none transition-all placeholder:text-zinc-700 ${errors.confirmPassword ? 'border-red-500' : 'border-zinc-800 focus:border-blue-600'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-[11px] ml-1">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg text-sm font-bold uppercase tracking-widest hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-50 mt-4"
          >
            {loading ? "CREATING..." : "CREATE ACCOUNT"}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-8 pt-6 border-t border-zinc-900 text-center space-y-4">
          <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500 hover:text-blue-400 ml-1">
              Sign In
            </Link>
          </p> 
          <p className="text-[11px] text-zinc-600 font-bold uppercase tracking-widest">
            Business Owner?{" "}
            <Link href="/business-register" className="text-zinc-400 hover:text-white ml-1">
              Register Business
            </Link>
          </p> 
        </div>
      </div>
    </div>
  );
}
