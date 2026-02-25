"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { UserPlus, Eye, EyeOff, User, Phone, Mail, Lock } from "lucide-react";
import SystemLoading from "@/components/SystemLoading";
import Link from "next/link";

export default function SignupPage() {
  const { signUp, user } = useAuth();
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);


  useEffect(() => {
    if (user) {
      setIsRedirecting(true);
      router.push(user.is_business ? "/business/dashboard" : "/user/dashboard");
    }
  }, [user, router]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const { error } = await signUp(email, password, phone, name);
      if (error) throw error
    } catch (err) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading || isRedirecting) {
      return <SystemLoading />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center px-4 py-12 font-sans selection:bg-blue-600">
      
      {/* 1. Sharp Logo Header */}
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

        {/* 2. The Form Container - Flat background, Sharp borders */}
        <form onSubmit={handleSignup} className="space-y-4">
          
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">Full Name</label>
            <div className="relative group">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors" size={16} />
              <input
                type="text"
                required
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#111111] border border-zinc-800 rounded-lg py-3 pl-10 pr-4 text-sm text-zinc-200 focus:outline-none focus:border-blue-600 transition-all placeholder:text-zinc-700"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">Phone</label>
            <div className="relative group">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors" size={16} />
              <input
                type="tel"
                required
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#111111] border border-zinc-800 rounded-lg py-3 pl-10 pr-4 text-sm text-zinc-200 focus:outline-none focus:border-blue-600 transition-all placeholder:text-zinc-700"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors" size={16} />
              <input
                type="email"
                required
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#111111] border border-zinc-800 rounded-lg py-3 pl-10 pr-4 text-sm text-zinc-200 focus:outline-none focus:border-blue-600 transition-all placeholder:text-zinc-700"
              />
            </div>
          </div>

          {/* Password Section (Split Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">Password</label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#111111] border border-zinc-800 rounded-lg py-3 px-4 text-sm text-zinc-200 focus:outline-none focus:border-blue-600 transition-all placeholder:text-zinc-700"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">Confirm</label>
              <div className="relative group">
                <input
                  type={showConfirm ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#111111] border border-zinc-800 rounded-lg py-3 px-4 text-sm text-zinc-200 focus:outline-none focus:border-blue-600 transition-all placeholder:text-zinc-700"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="py-2.5 px-3 rounded border border-red-500/20 bg-red-500/5 text-red-500 text-[11px] font-bold italic text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg text-sm font-bold uppercase tracking-widest hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-50 mt-4"
          >
            {loading ? "AUTHENTICATING..." : "CREATE ACCOUNT"}
          </button>
        </form>

        {/* 3. Footer Links */}
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