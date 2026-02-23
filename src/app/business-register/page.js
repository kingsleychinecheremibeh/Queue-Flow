"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Building2, Eye, EyeOff }  from "lucide-react";
import Link from "next/link";

export default function BusinessRegister()  {
  const { registerBusiness } = useAuth();
  const [name, setName] = useState("");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await registerBusiness(name, email, password, businessName, category);
      router.push("/business/dashboard");
    } catch (err) {
      console.error("Registration failed", err);
      setError(err.message || "Registration failed");
    } finally {
      setLoading(true);
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
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-3000 rounded-lg " 
              />  
            </div>
            <div>
              <input 
                type="text"
                required
                placeholder="Business name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-3000 rounded-lg " 
              />  
            </div>
            <div>
              <select 
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
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
                placeholder="enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />  
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder='Password'
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className='w-full p-2 border rounded pr-10'
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-2 cursor-pointer top-1/2  transform -translate-y-1/2 text-gray-500 hover:text-gray-700'
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Registering..." : "Register Business"}
            </button>  
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already registered?{" "}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}