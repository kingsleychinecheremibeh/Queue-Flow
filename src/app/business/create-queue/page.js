'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useQueue } from '@/context/QueueContext';
import { ArrowLeft, Sparkles, Clock, Tag, Loader2 } from 'lucide-react';

export default function CreateQueue() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { createQueue } = useQueue();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    queue_name: '',
    category: user?.category || '', 
    average_service_time: 10,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'average_service_time' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.queue_name || !formData.category) {
      alert('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      // Pass a single object to match the QueueContext signature
      const { error } = await createQueue({
        queue_name: formData.queue_name,
        category: formData.category,
        average_service_time: formData.average_service_time,
        business_name: user?.business_name || user?.full_name,
        is_open: true // Start the queue as open by default
      });

      if (error) throw error;

      router.push('/business/dashboard');
    } catch (error) {
      console.error("Error creating queue:", error);
      alert("Failed to create queue. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="font-bold text-gray-400 text-sm uppercase tracking-widest">Verifying Profile</p>
        </div>
      </div>
    );
  }

  if (!user || !user.is_business) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-sm w-full">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Tag className="w-8 h-8" />
          </div>
          <p className="text-gray-900 font-black text-xl uppercase tracking-tight">Restricted Access</p>
          <p className="text-sm text-gray-400 mt-2 font-medium">Only business accounts can launch and manage live queues.</p>
          <button 
            onClick={() => router.push('/')}
            className="mt-6 w-full py-3 bg-gray-900 text-white rounded-xl font-bold text-sm transition-transform active:scale-95"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/business/dashboard')}
            className="flex items-center gap-2 text-gray-400 hover:text-blue-600 transition-colors font-bold text-sm group uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Dashboard</span>
          </button>
          <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-tighter">
            Queue Builder v1.0
          </div>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-4 py-12">
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 p-10 border border-white">
          <div className="mb-10 text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Launch Queue</h1>
            <p className="text-gray-400 font-medium mt-1">Configure your live service point</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                Display Name
              </label>
              <input
                type="text"
                name="queue_name"
                required
                value={formData.queue_name}
                onChange={handleChange}
                placeholder="e.g., Express Counter, VIP Lounge"
                className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-blue-500 focus:bg-white transition-all outline-none font-bold text-gray-800 placeholder:text-gray-300 shadow-inner"
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                Category
              </label>
              <div className="relative">
                <select
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-blue-500 focus:bg-white transition-all outline-none appearance-none font-bold text-gray-800 shadow-inner"
                >
                  <option value="">Select an industry</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Restaurant">Restaurant</option>
                  <option value="Retail">Retail</option>
                  <option value="Bank">Bank</option>
                  <option value="Post Office">Post Office</option>
                  <option value="Other">Other</option>
                </select>
                <Tag className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                Avg. Service Time
              </label>
              <div className="relative group">
                <input
                  type="number"
                  name="average_service_time"
                  value={formData.average_service_time}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-blue-500 focus:bg-white transition-all outline-none font-bold text-gray-800 shadow-inner"
                />
                <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <span className="text-gray-300 text-[10px] font-black uppercase">minutes</span>
                  <Clock className="w-4 h-4 text-gray-300" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-5 rounded-[1.5rem] font-black text-white shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 ${
                isLoading 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>INITIALIZING...</span>
                </>
              ) : (
                'GO LIVE NOW'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}