"use client";

import { useAuth } from "@/context/AuthContext";
import { useQueue } from "@/context/QueueContext";
import { Users, Clock, Search, LogOut, ChevronRight, XCircle, Activity, LayoutGrid, Zap } from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";
import SystemLoading from "@/components/SystemLoading";

export default function UserDashboard() {
  const { user, logOut } = useAuth();
  const { queues, joinQueue, leaveQueue, getQueueData } = useQueue(); 
  const [searchTerm, setSearchTerm] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  
  const handleJoinQueue = async (queueId) => {
    if (user) {
      try {
        await joinQueue(queueId);
      } catch (err) {
        console.error("Failed to join queue:", err);
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleLeaveQueue = async (e, queueId) => {
    e.preventDefault(); 
    e.stopPropagation();
    
    if (confirm("Disconnect from this node? Your priority sequence will be reset.")) {
      setActionLoading(true);
      try {
        await leaveQueue(queueId);
      } catch (err) {
        console.error("Failed to leave queue:", err);
      } finally {
        setActionLoading(false)
      }
    }
  };

  const myActiveQueues = useMemo(() => 
    queues.map(q => getQueueData(q.id)).filter(data => data && data.userEntry),
    [queues, getQueueData]
  );

  const filteredQueues = queues.filter(q => 
    q.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user || queueLoading || actionLoading) {
    return <SystemLoading />;
  }


  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-400 font-sans selection:bg-blue-600">
      {/* --- HEADER --- */}
      <header className="bg-[#0a0a0a]/80 backdrop-blur-md border-b border-zinc-900 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)]">
              <Activity size={18} className="text-white" />
            </div>
            <h1 className="text-sm font-black text-white uppercase tracking-[0.3em]">Queue Flow</h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block border-r border-zinc-900 pr-6">
              <p className="text-[10px] font-black text-white uppercase tracking-wider">{user?.full_name}</p>
              <p className="text-[9px] text-blue-600 font-bold uppercase tracking-[0.2em]">Client_ID: {user?.id?.slice(0,8) || '00-00'}</p>
            </div>
            <button
              onClick={logOut}
              className="p-2 text-zinc-600 hover:text-red-500 transition-colors"
              title="Log Out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* WELCOME SECTION */}
        <div className="mb-12">
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">
            Greetings, {user?.full_name?.split(' ')[0]}
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <div className={`w-2 h-2 rounded-full ${myActiveQueues.length > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-800'}`} />
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
              {myActiveQueues.length > 0 
                ? `${myActiveQueues.length} ACTIVE_NODES_DETECTED` 
                : "SYSTEM IDLE: NO ACTIVE QUEUES"}
            </p>
          </div>
        </div>

        {/* --- SECTION: ACTIVE SPOTS --- */}
        {myActiveQueues.length > 0 && (
          <div className="mb-16">
            <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-6 flex items-center gap-2">
              <Zap size={14} className="text-blue-500" /> Live Telemetry
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myActiveQueues.map((data) => {
                const isServing = data.userEntry.status === 'serving';
                const estWait = Math.max(0, (data.position - 1) * (data.average_service_time || 5));

                return (
                  <div key={data.id} className="relative group overflow-hidden rounded-lg border border-zinc-900 bg-[#0f0f0f]">
                    <div className={`absolute top-0 left-0 w-1 h-full ${isServing ? 'bg-emerald-500' : 'bg-blue-600'}`} />
                    
                    <Link
                      href={`/user/queue/${data.id}`}
                      className="block p-8 hover:bg-zinc-900/50 transition-all"
                    >
                      <div className="mb-8">
                        <p className="text-[9px] font-black text-blue-500 uppercase tracking-[0.3em] mb-1">{data.category}</p>
                        <h4 className="font-black text-white text-2xl tracking-tight uppercase italic">{data.business_name}</h4>
                      </div>

                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[9px] text-zinc-600 uppercase font-black tracking-[0.2em] mb-1">Queue Priority</p>
                          <p className={`text-5xl font-black tracking-tighter ${isServing ? 'text-emerald-500' : 'text-white'}`}>
                            <span className="text-lg mr-1">#</span>{data.position}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] text-zinc-600 uppercase font-black tracking-[0.2em] mb-1">Time To Node</p>
                          <p className="text-2xl font-black text-white italic">
                            {isServing ? '0' : estWait}<span className="text-[10px] ml-1 not-italic text-zinc-500">MINS</span>
                          </p>
                        </div>
                      </div>
                    </Link>

                    {/* Quick Leave Button */}
                    {!isServing && (
                      <button
                        onClick={(e) => handleLeaveQueue(e, data.id)}
                        className="absolute top-6 right-6 p-2 text-zinc-700 hover:text-red-500 hover:bg-red-500/10 rounded border border-transparent hover:border-red-500/20 transition-all"
                        title="Disconnect"
                      >
                        <XCircle size={20} />
                      </button>
                    )}
                    
                    {isServing && (
                      <div className="absolute top-6 right-6 px-3 py-1 bg-emerald-500 text-black text-[9px] font-black rounded uppercase tracking-tighter animate-pulse">
                        ACCESS GRANTED
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* --- SECTION: SEARCH --- */}
        <div className="mb-10">
          <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-6 flex items-center gap-2">
            <LayoutGrid size={14} /> Available Network
          </h3>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by designation or protocol..."
              className="w-full pl-12 pr-4 py-4 bg-[#0f0f0f] border border-zinc-900 rounded-lg text-white font-bold text-sm outline-none focus:border-blue-600 transition-all placeholder:text-zinc-800"
            />
          </div>
        </div>

        {/* --- GRID: AVAILABLE QUEUES --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQueues.length > 0 ? (
            filteredQueues.map((queue) => {
              const queueData = getQueueData(queue.id);
              const isJoined = !!queueData?.userEntry;
              const isServing = queueData?.userEntry?.status === 'serving';

              return (
                <div 
                  key={queue.id} 
                  className={`bg-[#0f0f0f] rounded border p-6 flex flex-col transition-all ${
                    isJoined ? 'border-blue-900/50 bg-blue-950/5' : 'border-zinc-900 hover:border-zinc-700'
                  }`}
                >
                  <div className="mb-6">
                    <h4 className="font-black text-white text-lg tracking-tight uppercase">
                      {queue.business_name}
                    </h4>
                    <span className="inline-block mt-2 text-[8px] font-black text-blue-500 border border-blue-500/30 px-2 py-0.5 rounded uppercase tracking-[0.2em]">
                      {queue.category || 'General_Protocol'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-[#0a0a0a] p-3 rounded border border-zinc-900">
                      <p className="text-[8px] font-black text-zinc-600 uppercase tracking-tighter mb-1">Latency</p>
                      <div className="flex items-center gap-2 text-white font-black text-sm">
                        <Clock size={12} className="text-blue-500" />
                        {(queue.items?.filter(i => i.status === 'waiting').length || 0) * (queue.average_service_time || 5)}m
                      </div>
                    </div>
                    <div className="bg-[#0a0a0a] p-3 rounded border border-zinc-900">
                      <p className="text-[8px] font-black text-zinc-600 uppercase tracking-tighter mb-1">Load</p>
                      <div className="flex items-center gap-2 text-white font-black text-sm">
                        <Users size={12} className="text-zinc-500" />
                        {queue.items?.filter(i => i.status === 'waiting' || i.status === 'serving').length || 0}
                      </div>
                    </div>
                  </div>

                  {isJoined ? (
                    <div className="flex gap-2">
                      <Link
                        href={`/user/queue/${queue.id}`}
                        className={`flex-1 py-3 rounded font-black text-[10px] text-center tracking-[0.2em] transition-all active:scale-95 border ${
                          isServing 
                            ? 'bg-emerald-600 text-white border-emerald-500' 
                            : 'bg-transparent text-blue-500 border-blue-900 hover:bg-blue-900/20'
                        }`}
                      >
                        {isServing ? "ACCESS TURN" : "MONITOR SYNC"}
                      </Link>
                      
                      {!isServing && (
                        <button
                          onClick={(e) => handleLeaveQueue(e, queue.id)}
                          className="px-4 py-3 bg-transparent text-zinc-600 rounded font-black text-[10px] border border-zinc-900 hover:text-red-500 hover:border-red-900 transition-all"
                        >
                          OFF
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => queue.is_open && handleJoinQueue(queue.id)}
                      disabled={!queue.is_open}
                      className={`w-full py-3.5 rounded font-black text-[10px] tracking-[0.3em] transition-all active:scale-95 border ${
                        queue.is_open
                          ? "bg-white text-black hover:bg-blue-600 hover:text-white border-white"
                          : "bg-transparent text-zinc-800 border-zinc-900 cursor-not-allowed"
                      }`}
                    >
                      {queue.is_open ? "INITIATE JOIN" : "OFFLINE"}
                    </button>
                  )}
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-20 text-center border border-dashed border-zinc-900 rounded-lg">
              <p className="text-zinc-800 font-black text-xs uppercase tracking-[0.5em]">No Data Matching Query</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}