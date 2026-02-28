'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useQueue } from "@/context/QueueContext";
import {
  Users,
  Clock,
  ArrowLeft,
  Phone,
  CheckCircle,
  UserPlus,
  Play,
  ShieldAlert,
  Loader2,
  Activity
} from "lucide-react";
import { useState, useMemo } from "react";

export default function QueueManagement() {
  const { user } = useAuth();
  const { queues, callNext, completeService } = useQueue();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queueId = searchParams.get('queueId');
  const [isProcessing, setIsProcessing] = useState(false);

  // 1. Find the specific queue (YOUR LOGIC)
  const businessQueue = queues.find(q => q.id === queueId);

  // 2. Derive state (YOUR LOGIC - Memoized)
  const { currentCustomer, waitingCustomers } = useMemo(() => {
    return {
      currentCustomer: businessQueue?.items?.find((item) => item.status === "serving"),
      waitingCustomers: businessQueue?.items?.filter((item) => item.status === "waiting") || []
    };
  }, [businessQueue]);

  // YOUR HANDLERS (UNCHANGED)
  const handleCallNext = async () => {
    if (businessQueue && !isProcessing) {
      setIsProcessing(true);
      try {
        await callNext(businessQueue.id);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleComplete = async (itemId) => {
    if (businessQueue && !isProcessing) {
      setIsProcessing(true);
      try {
        await completeService(itemId); 
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // TECHNICAL SKIN: Loading state
  if (!businessQueue) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-center p-4">
        <div>
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-zinc-600 font-bold uppercase tracking-widest text-[10px] mb-4">Finding Queue Data...</p>
          <button onClick={() => router.push('/business/dashboard')} className="text-blue-500 font-black uppercase text-[10px] tracking-[0.3em] hover:text-white transition-colors">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-400 font-sans selection:bg-blue-600">
      {/* --- HEADER --- */}
      <header className="bg-[#0a0a0a]/80 backdrop-blur-md border-b border-zinc-900 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => router.push("/business/dashboard")}
              className="p-2 border border-zinc-900 text-zinc-500 hover:text-white hover:bg-zinc-900 rounded transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="h-8 w-px bg-zinc-900 hidden md:block" />
            <div>
              <h1 className="text-xl font-black text-white tracking-tighter uppercase leading-none mb-1">
                {businessQueue.queue_name}
              </h1>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.3em]">
                Operator: {user?.email?.split('@')[0] || 'Staff_Node'}
              </p>
            </div>
          </div>
          
          <div className={`px-4 py-1.5 rounded border text-[9px] font-black tracking-[0.2em] shadow-[0_0_15px_rgba(0,0,0,0.5)] ${
            businessQueue.is_open ? 'bg-emerald-950/20 border-emerald-500/50 text-emerald-500' : 'bg-red-950/20 border-red-500/50 text-red-500'
          }`}>
            {businessQueue.is_open ? 'SYSTEM_ONLINE' : 'SYSTEM_OFFLINE'}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* --- LEFT COLUMN: ACTION CENTER --- */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-[#0f0f0f] rounded-lg border border-zinc-900 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-600" />
              <div className="p-10">
                <div className="flex items-center justify-between mb-10">
                  <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] flex items-center gap-3">
                    <Activity size={14} className="text-blue-500" /> Current Processing
                  </h2>
                  {isProcessing && <Loader2 size={16} className="text-blue-500 animate-spin" />}
                </div>
                
                {currentCustomer ? (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="flex flex-col items-center text-center py-4">
                      <div className="w-28 h-28 bg-[#111111] border border-zinc-800 rounded flex items-center justify-center text-5xl font-black text-white mb-6 shadow-2xl">
                        <span className="text-blue-600 text-2xl mr-1">#</span>
                        {businessQueue.items.filter(i => i.status === 'completed').length + 1}
                      </div>
                      <h3 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">
                        {currentCustomer.profiles?.full_name || "Guest Protocol"}
                      </h3>
                      <p className="text-zinc-600 font-bold uppercase text-[10px] tracking-[0.4em]">
                        Service Start: {currentCustomer.called_at 
                          ? new Date(currentCustomer.called_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) 
                          : "Timestamp Pending"}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12">
                      <button
                        onClick={() => handleComplete(currentCustomer.id)}
                        disabled={isProcessing}
                        className="flex items-center justify-center gap-3 py-5 bg-blue-600 text-white rounded font-black text-[11px] uppercase tracking-[0.3em] hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-50"
                      >
                        <CheckCircle size={18} />
                        Complete Task
                      </button>
                      <button className="flex items-center justify-center gap-3 py-5 bg-[#111111] border border-zinc-800 text-zinc-400 rounded font-black text-[11px] uppercase tracking-[0.3em] hover:text-white hover:border-zinc-600 transition-all active:scale-[0.98]">
                        <Phone size={18} />
                        Send Alert
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16 border border-dashed border-zinc-800 rounded-lg">
                    <div className="w-16 h-16 bg-[#111111] rounded border border-zinc-800 flex items-center justify-center mx-auto mb-6">
                      {businessQueue.is_open ? (
                        <Users size={24} className="text-zinc-700" />
                      ) : (
                        <ShieldAlert size={24} className="text-red-900" />
                      )}
                    </div>
                    <h3 className="text-sm font-black text-white uppercase tracking-widest mb-2">
                      {businessQueue.is_open ? "Queue_Idle" : "Queue_Offline"}
                    </h3>
                    <p className="text-zinc-600 font-medium mb-10 max-w-xs mx-auto text-[11px] uppercase tracking-wider leading-relaxed">
                      {businessQueue.is_open 
                        ? "Execute 'Call Next' to pull the highest priority entry from the Queue." 
                        : "System offline. Re-initialize via dashboard to resume traffic."}
                    </p>
                    {businessQueue.is_open && waitingCustomers.length > 0 && (
                      <button
                        onClick={handleCallNext}
                        disabled={isProcessing}
                        className="px-12 py-4 bg-white text-black rounded font-black text-[11px] uppercase tracking-[0.4em] hover:bg-blue-600 hover:text-white transition-all active:scale-95 flex items-center gap-3 mx-auto"
                      >
                        <Play size={16} className="fill-current" />
                        Call Next
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* QUICK STATS */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-[#0f0f0f] p-8 rounded border border-zinc-900">
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-3">Buffer Count</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-black text-white tracking-tighter">{waitingCustomers.length}</p>
                  <span className="text-[10px] font-bold text-blue-600 uppercase">Users</span>
                </div>
              </div>
              <div className="bg-[#0f0f0f] p-8 rounded border border-zinc-900">
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-3">Est. Processing</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-black text-white tracking-tighter">
                    {waitingCustomers.length * (businessQueue.average_service_time || 5)}
                  </p>
                  <span className="text-[10px] font-bold text-amber-600 uppercase">Mins</span>
                </div>
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN: WAITING LIST --- */}
          <div className="lg:col-span-5">
            <div className="bg-[#0f0f0f] rounded-lg border border-zinc-900 flex flex-col h-[700px] overflow-hidden">
              <div className="p-6 border-b border-zinc-900 flex items-center justify-between bg-[#111111]">
                <h2 className="font-black text-white uppercase text-[10px] tracking-[0.4em]">Queue Stack</h2>
                <span className="px-3 py-1 bg-blue-600/10 border border-blue-600/30 text-blue-500 rounded text-[9px] font-black">
                  {waitingCustomers.length} ENTRIES
                </span>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
                {waitingCustomers.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                    <UserPlus size={40} className="mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-[0.5em]">
                      Stack Empty
                    </p>
                  </div>
                ) : (
                  waitingCustomers.map((customer, index) => (
                    <div
                      key={customer.id}
                      className="flex items-center justify-between p-5 bg-[#0a0a0a] border border-zinc-900 rounded hover:border-blue-900 transition-all group"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-10 h-10 bg-[#111111] rounded border border-zinc-800 flex items-center justify-center font-black text-[10px] text-zinc-600 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
                          0{index + 1}
                        </div>
                        <div>
                          <p className="font-bold text-white uppercase text-xs tracking-wider">{customer.profiles?.full_name || "Guest_User"}</p>
                          <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-1">
                            LOG: {customer.created_at 
                              ? new Date(customer.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
                              : "Now"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Wait Time</p>
                        <p className="text-xs font-black text-blue-500 mt-1">
                          {index * (businessQueue.average_service_time || 5)}M
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <div className="p-4 bg-[#111111] border-t border-zinc-900">
                <div className="flex items-center justify-between text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em]">
                  <span>Protocol: HTTP/2.0</span>
                  <span>Status: Sync_Active</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}