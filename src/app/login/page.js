"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, Users, Building2, Mail, Lock } from "lucide-react";
import SystemLoading from "@/components/SystemLoading";

export default function Login() {
  const { login, user } = useAuth();
  const router = useRouter();
  
  const [role, setRole] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (user) {
      setIsRedirecting(true);
      router.push(user.is_business ? "/business/dashboard" : "/user/dashboard");
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  if (loading || isRedirecting) {
    return <SystemLoading />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center px-4 font-sans">
      
      {/* 1. Brand Logo - Sharp & Minimal */}
      <div className="mb-8">
        <div className="w-10 h-10 border-2 border-blue-600 flex items-center justify-center font-bold text-blue-600 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.2)]">
          Q
        </div>
      </div>

      <div className="w-full max-w-[380px] animate-in fade-in zoom-in-95 duration-500">
        <div className="mb-8 text-left">
          <h1 className="text-xl font-bold tracking-tight">Login</h1>
          <p className="text-zinc-500 text-sm mt-1">Access your QueueFlow dashboard.</p>
        </div>

        {/* 2. Precision Toggle - Using sharp borders and flat colors */}
        <div className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-lg mb-6">
          <button 
            onClick={() => setRole("user")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-[11px] font-bold rounded-md transition-all ${
                role === "user" ? "bg-blue-600 text-white" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Users size={14} /> USER
          </button> 
          <button
            onClick={() => setRole("business")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-[11px] font-bold rounded-md transition-all ${
                role === "business" ? "bg-blue-600 text-white" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Building2 size={14} /> BUSINESS
          </button> 
        </div>

        {/* 3. The Form - Flat, No Gradients */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Email</label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors" size={16} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#111111] border border-zinc-800 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-600 transition-all placeholder:text-zinc-700"
                placeholder="email@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Password</label>
            </div>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors" size={16} />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#111111] border border-zinc-800 rounded-lg py-2.5 pl-10 pr-10 text-sm focus:outline-none focus:border-blue-600 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="py-2 px-3 rounded border border-red-500/20 bg-red-500/5 text-red-500 text-[12px] font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-sm font-bold transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "AUTHENTICATING..." : "SIGN IN"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-zinc-900 text-center">
          <p className="text-xs text-zinc-500 uppercase tracking-tighter">
            No account?{" "}
            <Link href="/signup" className="text-blue-500 hover:text-blue-400 font-bold ml-1">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}