"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";
import SystemLoading from "@/components/SystemLoading";
import { validateEmail, validatePassword } from "@/lib/validation";

export default function Login() {
  const { login, user } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validate
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    
    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError,
      });
      return;
    }

    setLoading(true);
    
    try {
      const result = await login(formData.email, formData.password);
      
      if (!result.success) {
        setErrors({ general: result.message || "Invalid credentials." });
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
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center px-4 font-sans">
      
      {/* Brand Logo */}
      <div className="mb-8">
        <div className="w-10 h-10 border-2 border-blue-600 flex items-center justify-center font-bold text-blue-600 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.2)]">
          Q
        </div>
      </div>

      <div className="w-full max-w-[380px] animate-in fade-in zoom-in-95 duration-500">
        <div className="mb-8 text-left">
          <h1 className="text-xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-zinc-500 text-sm mt-1">Sign in to your QueueFlow account.</p>
        </div>

        {/* Error Message */}
        {errors.general && (
          <div className="mb-6 py-3 px-4 rounded-lg border border-red-500/20 bg-red-500/10 flex items-center gap-3">
            <AlertCircle className="text-red-500 flex-shrink-0" size={18} />
            <p className="text-red-400 text-sm font-medium">{errors.general}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Email</label>
            <div className="relative group">
              <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${errors.email ? 'text-red-500' : 'text-zinc-600 group-focus-within:text-blue-500'}`} size={16} />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`w-full bg-[#111111] border rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none transition-all placeholder:text-zinc-700 ${errors.email ? 'border-red-500' : 'border-zinc-800 focus:border-blue-600'}`}
                placeholder="email@example.com"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-[11px] ml-1">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Password</label>
            </div>
            <div className="relative group">
              <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${errors.password ? 'text-red-500' : 'text-zinc-600 group-focus-within:text-blue-500'}`} size={16} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`w-full bg-[#111111] border rounded-lg py-2.5 pl-10 pr-10 text-sm focus:outline-none transition-all ${errors.password ? 'border-red-500' : 'border-zinc-800 focus:border-blue-600'}`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-[11px] ml-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-sm font-bold transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "SIGNING IN..." : "SIGN IN"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-zinc-900 text-center space-y-3">
          <p className="text-xs text-zinc-500 uppercase tracking-tighter">
            No account?{" "}
            <Link href="/signup" className="text-blue-500 hover:text-blue-400 font-bold ml-1">Register</Link>
          </p>
          <p className="text-xs text-zinc-600 uppercase tracking-tighter">
            Business Owner?{" "}
            <Link href="/business-register" className="text-zinc-400 hover:text-white font-bold ml-1">Register Business</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
