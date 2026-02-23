"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { LogIn, Eye, EyeOff, Users, Building2 } from "lucide-react";

export default function Login() {
  const { login, user } = useAuth(); // Grab 'user' to handle automatic redirects
  const router = useRouter();
  
  // Local state for the form
  const [role, setRole] = useState("user"); // Used to style buttons, but the DB defines the actual role
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // WATCH FOR AUTH CHANGES: 
  // Once the user is logged in, the AuthContext 'user' state will change.
  // This Effect handles sending them to the right dashboard.
  useEffect(() => {
    if (user) {
      if (user.is_business) {
        router.push("/business/dashboard");
      } else {
        router.push("/user/dashboard");
      }
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // We only need email and password for Supabase Auth.
      // The 'role' is already stored in your 'profiles' table from when they signed up.
      await login(email, password);
    } catch (err) {
      console.error('Login failed:', err);
      // Supabase returns helpful error messages (e.g., "Invalid login credentials")
      setError(err.message || "Failed to sign in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Sign in to manage your queues</p>
        </div>

        {/* This UI toggle is great for UX, helping users remember which account they are using */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button 
            type="button"
            onClick={() => setRole("user")}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                role === "user"
                  ? "border-blue-600 bg-blue-50 text-blue-600"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">User</span>
          </button> 
          <button
            type="button"
            onClick={() => setRole("business")}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                role === "business"
                  ? "border-blue-600 bg-blue-50 text-blue-600"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
          >
            <Building2 className="w-5 h-5" />
            <span className="font-medium">Business</span>
          </button> 
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded bg-red-50 border border-red-200">
              <p className="text-red-600 text-sm text-center font-medium">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors shadow-md"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="mt-8 space-y-3 text-center">
          <p className="text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link href="/register" className="text-blue-600 hover:text-blue-700 font-bold transition-colors">
              Sign up
            </Link>
          </p>

          <p className="text-sm text-gray-600">
            Own a business?{" "}
            <Link href="/business-register" className="text-blue-600 hover:text-blue-700 font-bold transition-colors">
              Register your business
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}