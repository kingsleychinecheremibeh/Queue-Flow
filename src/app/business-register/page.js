"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Building2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

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

  // Automatic redirect if session exists
  useEffect(() => {
    if (user) {
      router.push(user.is_business ? "/business/dashboard" : "/user/dashboard");
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // This sends the metadata to Supabase to trigger our SQL profile creation
      await registerBusiness(name, email, password, businessName, category);
      alert("Check your email for a confirmation link!");
      router.push("/login");
      // router.push is handled by the useEffect above
    } catch (err) {
      console.error("Registration failed", err);
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false); // Fixed: was true
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Register Business</h2>
            <p className="text-gray-600 mt-2">Start managing queues today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input 
                type="text"
                required
                placeholder="Your Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
              />  
            </div>

            <div>
              <input 
                type="text"
                required
                placeholder="Business Name (e.g., City Clinic)"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
              />  
            </div>

            <div>
              <select 
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white"
              >
                <option value="">Select a category</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Restaurant">Restaurant</option>
                <option value="Retail">Retail</option>
                <option value="Government">Government</option>
                <option value="Bank">Bank</option>
                <option value="Salon">Salon & Spa</option>
                <option value="Other">Other</option>
              </select>  
            </div>

            <div>
              <input
                type="email"
                required
                placeholder="Business Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />  
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder='Password'
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className='w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all pr-12'
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700'
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-medium text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 shadow-lg transform active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Registering..." : "Register Business"}
            </button>  
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 font-medium">
              Already registered?{" "}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-bold">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}