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
  Users 
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";

export default function QueueView() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { getQueueData, leaveQueue } = useQueue();
  
  const [currentTime, setCurrentTime] = useState(new Date());

  // FIXED: Initializing state directly from browser API to prevent render loops
  const [permission, setPermission] = useState(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      return Notification.permission;
    }
    return 'default';
  });

  const queueId = params?.id;

  // Memoize data to prevent crashes on partial re-renders
  const queueData = useMemo(() => {
    if (!queueId) return null;
    return getQueueData(queueId);
  }, [queueId, getQueueData]);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    
    // Background Service Worker registration
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

  // Trigger Notification when it's their turn
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

  const requestNotification = async () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
    }
  };

  const handleLeaveQueue = async () => {
    if (isServing || !queueId) return;
    if (window.confirm('Leave this line? You will lose your current spot forever.')) {
      try {
        await leaveQueue(queueId);
        router.push('/user/dashboard');
      } catch (err) {
        console.error("Error leaving queue:", err);
      }
    }
  };

  if (!queueData || !queue) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-3xl shadow-sm border border-gray-200 max-w-sm w-full">
          <Activity className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-900 font-bold tracking-tight">Syncing live data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Dynamic Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={() => router.push("/user/dashboard")}
            className="flex items-center gap-2 text-gray-400 hover:text-blue-600 font-black text-[10px] tracking-[0.2em] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>DASHBOARD</span>
          </button>
          
          <div className="flex items-center gap-3">
             <button 
                onClick={requestNotification}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black transition-all ${
                  permission === 'granted' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-700'
                }`}
             >
               {permission === 'granted' ? <Bell className="w-3 h-3" /> : <BellOff className="w-3 h-3" />}
               {permission === 'granted' ? 'ALERTS ON' : 'ENABLE ALERTS'}
             </button>
             <p className="text-sm font-mono font-bold text-gray-900 border-l border-gray-100 pl-3">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
             </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Main Status Display */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 overflow-hidden mb-8 border border-white">
          <div className={`p-8 text-white relative transition-all duration-700 ${isServing ? 'bg-emerald-600' : 'bg-blue-600'}`}>
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <p className="opacity-80 text-[10px] font-black uppercase tracking-widest mb-1">{queue.category || 'Service'}</p>
                <h1 className="text-3xl font-black tracking-tight">{queue.business_name}</h1>
              </div>
              {isServing && <Sparkles className="w-8 h-8 text-emerald-200 animate-pulse" />}
            </div>
          </div>
          
          <div className="p-10 text-center">
            {userEntry ? (
              <>
                <span className="text-gray-400 font-black uppercase tracking-widest text-[10px] mb-4 block">Your Spot</span>
                <div className={`leading-none font-black text-transparent bg-clip-text bg-linear-to-b from-gray-900 to-gray-600 mb-6 select-none transition-all ${isServing ? 'scale-110' : ''} ${position > 99 ? 'text-7xl' : 'text-[10rem]'}`}>
                  {position}
                </div>
                
                {isServing ? (
                  <div className="bg-emerald-50 text-emerald-700 border-2 border-emerald-100 rounded-3xl p-8 shadow-lg">
                    <h3 className="text-2xl font-black flex items-center justify-center gap-3 mb-2 animate-bounce">
                      <CheckCircle2 className="w-8 h-8" /> IT&apos;S YOUR TURN!
                    </h3>
                    <p className="font-bold uppercase text-xs tracking-widest">Please proceed for service</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-3 bg-blue-50 text-blue-700 rounded-2xl px-8 py-4 font-black border border-blue-100">
                      <Clock className="w-6 h-6" />
                      <span className="text-xl">~{estWaitTime} mins wait</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                      <Users className="w-3 h-3" />
                      {peopleAhead} {peopleAhead === 1 ? 'person' : 'people'} ahead
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="py-12 px-4 text-center">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                   <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Session Ended</h3>
                <button 
                   onClick={() => router.push("/user/dashboard")}
                   className="mt-6 flex items-center gap-3 mx-auto bg-gray-900 text-white px-10 py-4 rounded-2xl font-black hover:bg-black transition-all"
                >
                  <Home className="w-5 h-5" />
                  GO TO DASHBOARD
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Live List & Actions */}
        {userEntry && (
          <div className="bg-white rounded-[2rem] shadow-lg shadow-gray-200/50 p-8">
            <h2 className="text-xl font-black text-gray-900 mb-8 border-b border-gray-50 pb-4">Live Lineup</h2>
            <div className="space-y-3">
              {(queue?.items || [])
                .filter(item => item.status === 'waiting' || item.status === 'serving')
                .map((item, index) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-500 ${
                      item.user_id === user?.id ? "border-blue-600 bg-blue-50/50" : "border-gray-50 bg-gray-50/30"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${item.user_id === user?.id ? "bg-blue-600 text-white" : "bg-white text-gray-400 border border-gray-100"}`}>
                        {index + 1}
                      </div>
                      <p className={`text-sm font-black ${item.user_id === user?.id ? "text-blue-900" : "text-gray-600"}`}>
                        {item.user_id === user?.id ? "YOU" : (item.profiles?.full_name?.split(' ')[0] || "Guest")}
                      </p>
                    </div>
                  </div>
                ))}
            </div>

            {/* Trash Icon Button - Restored Here */}
            {!isServing && (
              <div className="mt-12 flex flex-col items-center pt-8 border-t border-gray-50">
                <button
                  onClick={handleLeaveQueue}
                  className="group flex items-center gap-2 px-6 py-3 text-gray-400 hover:text-red-600 transition-all duration-300 rounded-2xl hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 transition-transform group-hover:scale-110" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                    Cancel My Spot
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