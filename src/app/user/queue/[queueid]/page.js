'use client';

import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useQueue } from "@/context/QueueContext";
import { 
  ArrowLeft, 
  Clock, 
  Activity, 
  Trash2, 
  Home, 
  CheckCircle2, 
  Sparkles, 
  Bell, 
  BellOff, 
  Users,
  Wifi,
  Cpu
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import SystemLoading from "@/components/SystemLoading";

export default function QueueView() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { getQueueData, leaveQueue } = useQueue();
  const [actionLoading, setActionLoading] = useState(false);
  
  const [currentTime, setCurrentTime] = useState(new Date());

  const [permission, setPermission] = useState(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      return Notification.permission;
    }
    return 'default';
  });

  const queueId = params?.id;

  const queueData = useMemo(() => {
    if (!queueId) return null;
    return getQueueData(queueId);
  }, [queueId, getQueueData]);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    return () => clearInterval(interval);
  }, []);

  const userEntry = queueData?.userEntry;
  const queue = queueData?.queue;
  const position = queueData?.position || 0;
  const isServing = userEntry?.status === 'serving';
  const peopleAhead = Math.max(0, position - 1);
  const estWaitTime = peopleAhead * (queue?.average_service_time || 5);

  useEffect(() => {
    if (isServing && permission === 'granted') {
      try {
        new Notification("IT'S YOUR TURN!", {
          body: `Please head to ${queue?.business_name || 'the service area'}`,
          icon: "/icon.png"
        });
      } catch (e) {
        console.warn("Notification failed", e);
      }
    }
  }, [isServing, permission, queue?.business_name]);

  if (!queueData || !queue || actionLoading) {
    return <SystemLoading />;
  }

  const requestNotification = async () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
    }
  };

  const handleLeaveQueue = async () => {
    if (isServing || !queueId) return;
    if (window.confirm('Wipe current priority? Your spot in the sequence will be lost.')) {
      try {
        await leaveQueue(queueId);
        router.push('/user/dashboard');
      } catch (err) {
        console.error("Error leaving queue:", err);
        setActionLoading(false);
      }
    }
  };

  // if (!queueData || !queue) {
  //   return (
  //     <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
  //       <div className="text-center space-y-4">
  //         <Activity className="w-12 h-12 text-blue-600 animate-pulse mx-auto" />
  //         <p className="text-zinc-500 font-black text-[10px] uppercase tracking-[0.4em]">Establishing_Sync...</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-400 font-sans selection:bg-blue-600">
      {/* --- TECH HEADER --- */}
      <div className="bg-[#0a0a0a]/80 backdrop-blur-md border-b border-zinc-900 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => router.push("/user/dashboard")}
            className="group flex items-center gap-3 text-zinc-600 hover:text-white transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-black text-[9px] tracking-[0.3em] uppercase">Return_to_Grid</span>
          </button>
          
          <div className="flex items-center gap-6">
             <button 
                onClick={requestNotification}
                className={`flex items-center gap-2 px-3 py-1 rounded border text-[9px] font-black tracking-widest transition-all ${
                  permission === 'granted' 
                  ? 'border-emerald-900/50 text-emerald-500 bg-emerald-500/5' 
                  : 'border-blue-900/50 text-blue-500 bg-blue-500/5'
                }`}
             >
               {permission === 'granted' ? <Bell size={12} /> : <BellOff size={12} />}
               {permission === 'granted' ? 'ALERTS: ON' : 'ENABLE_NOTIF'}
             </button>
             <p className="text-[11px] font-black text-white italic tracking-tighter">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
             </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* --- MAIN TELEMETRY CARD --- */}
        <div className="bg-[#0f0f0f] rounded-lg border border-zinc-900 overflow-hidden mb-8 shadow-2xl">
          <div className={`p-8 text-white relative border-b border-zinc-900 ${isServing ? 'bg-emerald-600/10' : 'bg-blue-600/5'}`}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-blue-500 text-[9px] font-black uppercase tracking-[0.4em] mb-2">Node_Registry: {queue.category || 'General'}</p>
                <h1 className="text-4xl font-black tracking-tighter uppercase italic italic">{queue.business_name}</h1>
              </div>
              <div className="flex items-center gap-2">
                <Wifi className={`${isServing ? 'text-emerald-500' : 'text-blue-500'} animate-pulse`} size={20} />
                <span className="text-[9px] font-black text-zinc-500 tracking-widest uppercase">Live_Feed</span>
              </div>
            </div>
          </div>
          
          <div className="p-12 text-center relative">
            {userEntry ? (
              <div className="animate-in fade-in zoom-in duration-700">
                <span className="text-zinc-600 font-black uppercase tracking-[0.5em] text-[10px] mb-6 block">Current_Vector</span>
                
                <div className={`leading-none font-black italic tracking-tighter transition-all duration-1000 ${
                  isServing ? 'text-emerald-500 drop-shadow-[0_0_35px_rgba(16,185,129,0.4)]' : 'text-white drop-shadow-[0_0_25px_rgba(37,99,235,0.2)]'
                } ${position > 99 ? 'text-8xl' : 'text-[12rem]'}`}>
                  <span className="text-4xl opacity-50 mr-2 not-italic">#</span>{position}
                </div>
                
                {isServing ? (
                  <div className="mt-8 bg-emerald-500/10 border border-emerald-500/50 rounded p-10 animate-pulse">
                    <h3 className="text-2xl font-black text-emerald-500 flex items-center justify-center gap-4 mb-2 tracking-tighter uppercase italic">
                      <Sparkles className="w-8 h-8" /> Access_Granted
                    </h3>
                    <p className="text-zinc-400 font-black text-[9px] tracking-[0.3em] uppercase">Proceed to Service Hub Immediately</p>
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-8">
                    <div className="flex items-center gap-4 bg-zinc-900/50 border border-zinc-800 rounded px-10 py-5">
                      <Clock className="w-5 h-5 text-blue-500" />
                      <div className="text-left">
                        <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Est_Latency</p>
                        <span className="text-2xl font-black text-white italic">~{estWaitTime}<span className="text-[10px] ml-1 text-zinc-500 not-italic uppercase">mins</span></span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 bg-zinc-900/50 border border-zinc-800 rounded px-10 py-5">
                      <Users className="w-5 h-5 text-zinc-500" />
                      <div className="text-left">
                        <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Load_Ahead</p>
                        <span className="text-2xl font-black text-white italic">{peopleAhead}<span className="text-[10px] ml-1 text-zinc-500 not-italic uppercase">units</span></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-20 text-center animate-in slide-in-from-bottom-4">
                <div className="w-24 h-24 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                   <CheckCircle2 size={40} />
                </div>
                <h3 className="text-3xl font-black text-white mb-8 tracking-tighter uppercase italic">Sequence_Complete</h3>
                <button 
                   onClick={() => router.push("/user/dashboard")}
                   className="flex items-center gap-4 mx-auto bg-blue-600 text-white px-12 py-5 rounded font-black text-[10px] tracking-[0.3em] hover:bg-blue-700 transition-all active:scale-95 shadow-xl shadow-blue-900/20"
                >
                  <Home size={16} />
                  EXIT_TO_HOME
                </button>
              </div>
            )}
          </div>
        </div>

        {/* --- LIVE LINEUP MODULE --- */}
        {userEntry && (
          <div className="bg-[#0f0f0f] rounded-lg border border-zinc-900 p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-8 border-b border-zinc-900 pb-6">
              <h2 className="text-[11px] font-black text-white uppercase tracking-[0.4em] flex items-center gap-3">
                <Cpu size={16} className="text-blue-500" /> Live_Queue_Sequence
              </h2>
              <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Sync_Status: Nominal</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(queue?.items || [])
                .filter(item => item.status === 'waiting' || item.status === 'serving')
                .map((item, index) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-4 rounded border transition-all ${
                      item.user_id === user?.id 
                      ? "border-blue-600 bg-blue-600/10 shadow-[0_0_20px_rgba(37,99,235,0.1)]" 
                      : "border-zinc-900 bg-[#0a0a0a]/50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded text-[10px] font-black flex items-center justify-center border ${
                        item.user_id === user?.id 
                        ? "bg-blue-600 text-white border-blue-400" 
                        : "bg-zinc-900 text-zinc-600 border-zinc-800"
                      }`}>
                        {index + 1}
                      </div>
                      <p className={`text-[10px] font-black tracking-widest uppercase ${item.user_id === user?.id ? "text-white" : "text-zinc-500"}`}>
                        {item.user_id === user?.id ? "YOU // ACTIVE" : (item.profiles?.full_name?.split(' ')[0] || "Guest_User")}
                      </p>
                    </div>
                    {item.user_id !== user?.id && <div className="w-1 h-1 bg-zinc-800 rounded-full" />}
                  </div>
                ))}
            </div>

            {/* --- DECOMMISSION ACTION --- */}
            {!isServing && (
              <div className="mt-12 pt-8 border-t border-zinc-900 flex justify-center">
                <button
                  onClick={handleLeaveQueue}
                  className="group flex items-center gap-3 px-8 py-3 text-zinc-600 hover:text-red-500 hover:bg-red-500/5 rounded border border-transparent hover:border-red-500/20 transition-all duration-300"
                >
                  <Trash2 size={16} className="group-hover:rotate-12 transition-transform" />
                  <span className="text-[9px] font-black uppercase tracking-[0.3em]">
                    Abort Sequence
                  </span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}