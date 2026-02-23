"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { LogIn, Eye, EyeOff, Users, Building2 } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();
  const [ role, setRole ] = useState("user")

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password, role);
      if (role === "user") {
        router.push("/user/dashboard");
      } else {
        router.push("/business/dashboard")
      }
    } catch (error) {
      console.error ('login failed:', error);
    }finally{
      setLoading(false)
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
          <input
            type="email"
            required
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign up
            </Link>
          </p>

          <p className="text-sm text-gray-600 mt-2">
            Have a business?{" "}
            <Link href="/business-register" className="text-blue-600 hover:text-blue-700 font-medium">
              Register as business
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
