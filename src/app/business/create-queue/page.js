'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useQueue } from '@/context/QueueContext';
import { ArrowLeft, Sparkles, Clock, Tag, Loader2, ShieldAlert, Activity } from 'lucide-react';

export default function CreateQueue() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { createQueue } = useQueue();
  const [isLoading, setIsLoading] = useState(false);
  
  // YOUR LOGIC: State remains exactly as provided
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
      // YOUR LOGIC: Signature matches your context exactly
      const { error } = await createQueue({
        queue_name: formData.queue_name,
        category: formData.category,
        average_service_time: formData.average_service_time,
        business_name: user?.business_name || user?.full_name,
        is_open: true 
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

  // TECHNICAL SKIN: Auth Loading State
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="font-bold text-zinc-600 text-[10px] uppercase tracking-[0.3em]">Authenticating_Session</p>
        </div>
      </div>
    );
  }

  // TECHNICAL SKIN: Restricted Access State
  if (!user || !user.is_business) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-6">
        <div className="text-center bg-[#0f0f0f] p-10 border border-zinc-900 max-w-sm w-full rounded-lg">
          <div className="w-16 h-16 bg-red-950/20 text-red-500 border border-red-900/50 rounded flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <p className="text-white font-black text-xl uppercase tracking-tighter">Access Denied</p>
          <p className="text-xs text-zinc-500 mt-4 font-bold uppercase tracking-widest leading-relaxed">
            Only verified business nodes can initialize live queues.
          </p>
          <button 
            onClick={() => router.push('/')}
            className="mt-8 w-full py-3 bg-white text-black font-black text-[10px] uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all active:scale-95"
          >
            Return to Root
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-400 font-sans selection:bg-blue-600">
      {/* HEADER: Technical Sub-navigation */}
      <header className="border-b border-zinc-900 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => router.push('/business/dashboard')}
            className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors font-bold text-[10px] group uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Terminal</span>
          </button>
          <div className="px-3 py-1 border border-blue-900/50 bg-blue-900/10 text-blue-500 rounded text-[9px] font-black uppercase tracking-widest">
            Queue_Builder_v1.0
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="bg-[#0f0f0f] border border-zinc-900 p-8 md:p-12 rounded-lg shadow-2xl shadow-black">
          
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="text-blue-600" size={20} />
              <h1 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em]">Initialize_Node</h1>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Launch New Queue</h2>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-2">Configure live service parameters</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* INPUT: Display Name */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">
                Display Designation
              </label>
              <input
                type="text"
                name="queue_name"
                required
                value={formData.queue_name}
                onChange={handleChange}
                placeholder="e.g., EXPRESS_COUNTER_01"
                className="w-full px-5 py-4 bg-[#111111] border border-zinc-800 rounded text-white focus:border-blue-600 transition-all outline-none font-bold text-sm placeholder:text-zinc-800"
              />
            </div>

            {/* GRID: Category & Service Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">
                  Sector Classification
                </label>
                <div className="relative">
                  <select
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-[#111111] border border-zinc-800 rounded text-white focus:border-blue-600 transition-all outline-none appearance-none font-bold text-sm cursor-pointer"
                  >
                    <option value="">Select Category</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Restaurant">Restaurant</option>
                    <option value="Retail">Retail</option>
                    <option value="Bank">Bank</option>
                    <option value="Post Office">Post Office</option>
                    <option value="Other">Other</option>
                  </select>
                  <Tag className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">
                  Est. Cycle Time
                </label>
                <div className="relative group">
                  <input
                    type="number"
                    name="average_service_time"
                    value={formData.average_service_time}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-5 py-4 bg-[#111111] border border-zinc-800 rounded text-white focus:border-blue-600 transition-all outline-none font-bold text-sm"
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                    <span className="text-zinc-700 text-[9px] font-black uppercase tracking-tighter">MINS</span>
                    <Clock className="w-4 h-4 text-zinc-700" />
                  </div>
                </div>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-5 rounded font-black text-[11px] uppercase tracking-[0.3em] transition-all active:scale-[0.98] flex items-center justify-center gap-3 ${
                  isLoading 
                    ? 'bg-blue-900/50 text-blue-300 cursor-not-allowed border border-blue-900/50' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-900/20'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Deploying_Node...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Deploy Live Queue</span>
                  </>
                )}
              </button>
              <p className="mt-6 text-[9px] text-zinc-700 text-center font-bold uppercase tracking-[0.2em]">
                Verified Connection: Secure_Encrypted_Protocol
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}