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
  ShieldAlert
} from "lucide-react";
import { useState, useMemo } from "react";

export default function QueueManagement() {
  const { user } = useAuth();
  const { queues, callNext, completeService } = useQueue();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queueId = searchParams.get('queueId');
  const [isProcessing, setIsProcessing] = useState(false);

  // 1. Find the specific queue
  const businessQueue = queues.find(q => q.id === queueId);

  // 2. Derive state (Memoized for performance)
  const { currentCustomer, waitingCustomers } = useMemo(() => {
    return {
      currentCustomer: businessQueue?.items?.find((item) => item.status === "serving"),
      waitingCustomers: businessQueue?.items?.filter((item) => item.status === "waiting") || []
    };
  }, [businessQueue]);

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

  if (!businessQueue) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-center p-4">
        <div>
          <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse mx-auto mb-4" />
          <p className="text-gray-500 font-bold mb-4">Finding your queue...</p>
          <button onClick={() => router.push('/business/dashboard')} className="text-blue-600 font-black uppercase text-xs tracking-widest">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* --- HEADER --- */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/business/dashboard")}
              className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-black text-gray-900 leading-none mb-1">
                {businessQueue.queue_name}
              </h1>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                Active Session: {user?.email?.split('@')[0] || 'Staff'}
              </p>
            </div>
          </div>
          
          <div className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest border-2 shadow-sm ${
            businessQueue.is_open ? 'bg-green-50 border-green-200 text-green-600' : 'bg-red-50 border-red-200 text-red-600'
          }`}>
            {businessQueue.is_open ? '● ONLINE' : '○ OFFLINE'}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* --- LEFT COLUMN: ACTION CENTER --- */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-white overflow-hidden">
              <div className="bg-linear-to-r from-blue-600 to-indigo-700 h-1.5" />
              <div className="p-8">
                <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Live Status
                </h2>
                
                {currentCustomer ? (
                  <div className="animate-in fade-in zoom-in-95 duration-300">
                    <div className="flex flex-col items-center text-center py-6">
                      <div className="w-24 h-24 bg-blue-50 rounded-3xl flex items-center justify-center text-4xl font-black text-blue-600 mb-4 border-2 border-blue-100 shadow-inner">
                        #{businessQueue.items.filter(i => i.status === 'completed').length + 1}
                      </div>
                      <h3 className="text-3xl font-black text-gray-900 mb-1">
                        {currentCustomer.profiles?.full_name || "Guest User"}
                      </h3>
                      <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                        Serving since {currentCustomer.called_at 
                          ? new Date(currentCustomer.called_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                          : "Just now"}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-8">
                      <button
                        onClick={() => handleComplete(currentCustomer.id)}
                        disabled={isProcessing}
                        className="flex items-center justify-center gap-2 py-4 bg-green-500 text-white rounded-2xl font-black hover:bg-green-600 transition-all shadow-lg shadow-green-200 active:scale-95 disabled:opacity-50"
                      >
                        <CheckCircle className="w-5 h-5" />
                        FINISH
                      </button>
                      <button className="flex items-center justify-center gap-2 py-4 bg-gray-100 text-gray-600 rounded-2xl font-black hover:bg-gray-200 transition-all active:scale-95">
                        <Phone className="w-5 h-5" />
                        NOTIFY
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-3xl animate-in fade-in duration-500">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      {businessQueue.is_open ? (
                        <Users className="w-8 h-8 text-gray-200" />
                      ) : (
                        <ShieldAlert className="w-8 h-8 text-red-200" />
                      )}
                    </div>
                    <h3 className="text-lg font-black text-gray-900 mb-1">
                      {businessQueue.is_open ? "Counter is empty" : "Queue is Offline"}
                    </h3>
                    <p className="text-gray-400 font-bold mb-6 max-w-70 mx-auto text-sm">
                      {businessQueue.is_open 
                        ? "Call the next customer from the list to begin service." 
                        : "All waiting entries were reset. Switch to Online to accept new customers."}
                    </p>
                    {businessQueue.is_open && waitingCustomers.length > 0 && (
                      <button
                        onClick={handleCallNext}
                        disabled={isProcessing}
                        className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-95 flex items-center gap-3 mx-auto"
                      >
                        <Play className="w-5 h-5 fill-current" />
                        CALL NEXT
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* QUICK STATS */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">In Line</p>
                <p className="text-3xl font-black text-gray-900">{waitingCustomers.length}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Est. Wait</p>
                <p className="text-3xl font-black text-gray-900">
                  {waitingCustomers.length * (businessQueue.average_service_time || 5)}m
                </p>
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN: WAITING LIST --- */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm flex flex-col h-150 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <h2 className="font-black text-gray-900 uppercase text-sm tracking-tight">Up Next</h2>
                <span className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-[10px] font-black">
                  {waitingCustomers.length} TOTAL
                </span>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {waitingCustomers.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                    <UserPlus className="w-12 h-12 mb-2" />
                    <p className="text-xs font-black uppercase tracking-widest">
                      {businessQueue.is_open ? "No customers waiting" : "Queue Reset"}
                    </p>
                  </div>
                ) : (
                  waitingCustomers.map((customer, index) => (
                    <div
                      key={customer.id}
                      className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:border-blue-200 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center font-black text-gray-400 border border-gray-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-black text-gray-900">{customer.profiles?.full_name || "Guest"}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase">
                            Joined {customer.created_at 
                              ? new Date(customer.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
                              : "Just now"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-gray-400 uppercase">Wait</p>
                        <p className="text-sm font-black text-blue-600">
                          {index * (businessQueue.average_service_time || 5)}m
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}