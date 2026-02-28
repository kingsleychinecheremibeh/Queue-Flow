"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Building2, Eye, EyeOff, Briefcase, Mail, Lock, User, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import SystemLoading from "@/components/SystemLoading";
import { validateBusinessForm } from "@/lib/validation";

export default function BusinessRegister() {
  const { registerBusiness, user } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    businessName: "",
    category: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");

    // Validate form
    const validation = validateBusinessForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);

    try {
      const result = await registerBusiness(
        formData.name,
        formData.email,
        formData.password,
        formData.businessName,
        formData.category
      );
      
      if (result.success) {
        if (result.requiresConfirmation) {
          setSuccessMessage(result.message);
          // Clear form
          setFormData({
            name: "",
            email: "",
            password: "",
            businessName: "",
            category: "",
          });
        }
      } else {
        setErrors({ general: result.message || "Registration failed. Please try again." });
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
      
      {/* Brand Header */}
      <div className="mb-8">
        <div className="w-10 h-10 border-2 border-blue-600 flex items-center justify-center font-bold text-blue-600 rounded-lg">
          Q
        </div>
      </div>

      <div className="w-full max-w-[420px]">
        <div className="mb-8 text-left">
          <h1 className="text-xl font-bold tracking-tight">Business Registration</h1>
          <p className="text-zinc-500 text-sm mt-1">Scale your operations with QueueFlow.</p>
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

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Admin Name */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">Admin Name</label>
            <div className="relative group">
              <User className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${errors.name ? 'text-red-500' : 'text-zinc-600 group-focus-within:text-blue-500'}`} size={16} />
              <input 
                type="text"
                name="name"
                required
                placeholder="Your Full Name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full bg-[#111111] border rounded-lg py-3 pl-10 pr-4 text-sm text-zinc-200 focus:outline-none transition-all placeholder:text-zinc-700 ${errors.name ? 'border-red-500' : 'border-zinc-800 focus:border-blue-600'}`}
              />  
            </div>
            {errors.name && (
              <p className="text-red-500 text-[11px] ml-1">{errors.name}</p>
            )}
          </div>

          {/* Business Name */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">Business Entity</label>
            <div className="relative group">
              <Building2 className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${errors.businessName ? 'text-red-500' : 'text-zinc-600 group-focus-within:text-blue-500'}`} size={16} />
              <input 
                type="text"
                name="businessName"
                required
                placeholder="e.g., City General Hospital"
                value={formData.businessName}
                onChange={handleChange}
                className={`w-full bg-[#111111] border rounded-lg py-3 pl-10 pr-4 text-sm text-zinc-200 focus:outline-none transition-all placeholder:text-zinc-700 ${errors.businessName ? 'border-red-500' : 'border-zinc-800 focus:border-blue-600'}`}
              />  
            </div>
            {errors.businessName && (
              <p className="text-red-500 text-[11px] ml-1">{errors.businessName}</p>
            )}
          </div>

          {/* Category Selector */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">Industry</label>
            <div className="relative group">
              <Briefcase className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${errors.category ? 'text-red-500' : 'text-zinc-600 group-focus-within:text-blue-500'}`} size={16} />
              <select 
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className={`w-full bg-[#111111] border rounded-lg py-3 pl-10 pr-4 text-sm text-zinc-200 focus:outline-none transition-all appearance-none cursor-pointer ${errors.category ? 'border-red-500' : 'border-zinc-800 focus:border-blue-600'}`}
              >
                <option value="" className="bg-[#0a0a0a]">Select Industry</option>
                <option value="Healthcare" className="bg-[#0a0a0a]">Healthcare</option>
                <option value="Restaurant" className="bg-[#0a0a0a]">Restaurant</option>
                <option value="Retail" className="bg-[#0a0a0a]">Retail</option>
                <option value="Government" className="bg-[#0a0a0a]">Government</option>
                <option value="Bank" className="bg-[#0a0a0a]">Banking</option>
                <option value="Salon" className="bg-[#0a0a0a]">Salon & Spa</option>
                <option value="Other" className="bg-[#0a0a0a]">Other</option>
              </select>   
            </div>
            {errors.category && (
              <p className="text-red-500 text-[11px] ml-1">{errors.category}</p>
            )}
          </div>

          {/* Business Email */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">Work Email</label>
            <div className="relative group">
              <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${errors.email ? 'text-red-500' : 'text-zinc-600 group-focus-within:text-blue-500'}`} size={16} />
              <input
                type="email"
                name="email"
                required
                placeholder="corporate@business.com"
                value={formData.email}
                onChange={handleChange}
                className={`w-full bg-[#111111] border rounded-lg py-3 pl-10 pr-4 text-sm text-zinc-200 focus:outline-none transition-all placeholder:text-zinc-700 ${errors.email ? 'border-red-500' : 'border-zinc-800 focus:border-blue-600'}`}
              />  
            </div>
            {errors.email && (
              <p className="text-red-500 text-[11px] ml-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">Secure Password</label>
            <div className="relative group">
              <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${errors.password ? 'text-red-500' : 'text-zinc-600 group-focus-within:text-blue-500'}`} size={16} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder='••••••••'
                value={formData.password}
                onChange={handleChange}
                required
                className={`w-full bg-[#111111] border rounded-lg py-3 pl-10 pr-12 text-sm text-zinc-200 focus:outline-none transition-all placeholder:text-zinc-700 ${errors.password ? 'border-red-500' : 'border-zinc-800 focus:border-blue-600'}`}
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors'
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-[11px] ml-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3.5 rounded-lg text-sm font-bold uppercase tracking-widest hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-50 mt-4"
          >
            {loading ? "REGISTERING..." : "REGISTER BUSINESS"}
          </button>   
        </form>

        {/* Footer Links */}
        <div className="mt-8 pt-6 border-t border-zinc-900 text-center space-y-4">
          <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest">
            Company already registered?{" "}
            <Link href="/login" className="text-blue-500 hover:text-blue-400 ml-1">
              Sign In
            </Link>
          </p>
          <p className="text-[11px] text-zinc-600 font-bold uppercase tracking-widest">
            Not a business?{" "}
            <Link href="/signup" className="text-zinc-400 hover:text-white ml-1">
              Personal Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
