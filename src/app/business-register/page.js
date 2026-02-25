"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Building2, Eye, EyeOff, Briefcase, Mail, Lock, User } from "lucide-react";
import Link from "next/link";
import SystemLoading from "@/components/SystemLoading";

export default function BusinessRegister() {
  const { registerBusiness, user } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (user) {
      setIsRedirecting(true)
      router.push(user.is_business ? "/business/dashboard" : "/user/dashboard");
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await registerBusiness(name, email, password, businessName, category);
      alert("Check your email for a confirmation link!");
      router.push("/login");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
   
  if (loading || isRedirecting) {
    return <SystemLoading />;
  }
  


  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center px-4 py-12 font-sans selection:bg-blue-600">
      
      {/* 1. Sharp Brand Header */}
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

        {/* 2. The Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Admin Name */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">Admin Name</label>
            <div className="relative group">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors" size={16} />
              <input 
                type="text"
                required
                placeholder="Your Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#111111] border border-zinc-800 rounded-lg py-3 pl-10 pr-4 text-sm text-zinc-200 focus:outline-none focus:border-blue-600 transition-all placeholder:text-zinc-700" 
              />  
            </div>
          </div>

          {/* Business Name */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">Business Entity</label>
            <div className="relative group">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors" size={16} />
              <input 
                type="text"
                required
                placeholder="e.g., City General Hospital"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full bg-[#111111] border border-zinc-800 rounded-lg py-3 pl-10 pr-4 text-sm text-zinc-200 focus:outline-none focus:border-blue-600 transition-all placeholder:text-zinc-700" 
              />  
            </div>
          </div>

          {/* Category Selector */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">Industry</label>
            <div className="relative group">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors" size={16} />
              <select 
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#111111] border border-zinc-800 rounded-lg py-3 pl-10 pr-4 text-sm text-zinc-200 focus:outline-none focus:border-blue-600 transition-all appearance-none cursor-pointer"
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
          </div>

          {/* Business Email */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">Work Email</label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors" size={16} />
              <input
                type="email"
                required
                placeholder="corporate@business.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#111111] border border-zinc-800 rounded-lg py-3 pl-10 pr-4 text-sm text-zinc-200 focus:outline-none focus:border-blue-600 transition-all placeholder:text-zinc-700"
              />  
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">Secure Password</label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors" size={16} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder='••••••••'
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full bg-[#111111] border border-zinc-800 rounded-lg py-3 pl-10 pr-12 text-sm text-zinc-200 focus:outline-none focus:border-blue-600 transition-all placeholder:text-zinc-700"
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors'
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="py-2.5 px-3 rounded border border-red-500/20 bg-red-500/5 text-red-500 text-[11px] font-bold text-center italic">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3.5 rounded-lg text-sm font-bold uppercase tracking-widest hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-50 mt-4"
          >
            {loading ? "INITIALIZING..." : "REGISTER BUSINESS"}
          </button>   
        </form>

        {/* 3. Footer Links */}
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