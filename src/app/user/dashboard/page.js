"use client";

import { useAuth } from "@/context/AuthContext";
import { useQueue } from "@/context/QueueContext";
import { Users, Clock, Search, LogOut, ChevronRight, XCircle } from "lucide-react"; // Added XCircle
import Link from "next/link";
import { useState, useMemo } from "react";

export default function UserDashboard() {
  const { user, logOut } = useAuth();
  // Added leaveQueue here
  const { queues, joinQueue, leaveQueue, getQueueData } = useQueue(); 
  const [searchTerm, setSearchTerm] = useState("");

  const handleJoinQueue = async (queueId) => {
    if (user) {
      try {
        await joinQueue(queueId);
      } catch (err) {
        console.error("Failed to join queue:", err);
      }
    }
  };

  // Logic: Handle Leave Queue
  const handleLeaveQueue = async (e, queueId) => {
    e.preventDefault(); // Prevent Link navigation if inside a Link
    e.stopPropagation();
    
    if (confirm("Are you sure you want to leave this line? You will lose your current position.")) {
      try {
        await leaveQueue(queueId);
      } catch (err) {
        console.error("Failed to leave queue:", err);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header remain the same */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-100">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">QueueFlow</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900">{user?.full_name}</p>
                <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Customer</p>
              </div>
              <button
                onClick={logOut}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-gray-900">Welcome, {user?.full_name?.split(' ')[0]}! 👋</h2>
          <p className="text-gray-500 font-medium">
            {myActiveQueues.length > 0 
              ? `You're currently in ${myActiveQueues.length} line(s).` 
              : "Find a business and join the queue to get started."}
          </p>
        </div>

        {/* Section: Your Active Spots (Added Leave Action) */}
        {myActiveQueues.length > 0 && (
          <div className="mb-10">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Your Active Spots</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myActiveQueues.map((data) => {
                const isServing = data.userEntry.status === 'serving';
                const estWait = Math.max(0, (data.position - 1) * (data.average_service_time || 5));

                return (
                  <div key={data.id} className="relative group">
                    <Link
                      href={`/user/queue/${data.id}`}
                      className={`block bg-white border-2 rounded-2xl p-6 transition-all shadow-sm hover:shadow-md ${
                        isServing ? 'border-green-500 bg-green-50/30' : 'border-blue-500'
                      }`}
                    >
                      <div className="mb-6">
                        <h4 className="font-black text-gray-900 text-xl">{data.business_name}</h4>
                        <p className="text-xs font-bold text-gray-400 uppercase">{data.category}</p>
                      </div>

                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Position</p>
                          <p className={`text-4xl font-black ${isServing ? 'text-green-600' : 'text-blue-600'}`}>
                            #{data.position}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Est. Wait</p>
                          <p className="text-xl font-black text-gray-800">
                            {isServing ? '0' : estWait} <span className="text-sm font-bold">mins</span>
                          </p>
                        </div>
                      </div>
                    </Link>

                    {/* Quick Leave Button (Top Right) */}
                    {!isServing && (
                      <button
                        onClick={(e) => handleLeaveQueue(e, data.id)}
                        className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        title="Leave Queue"
                      >
                        <XCircle className="w-6 h-6" />
                      </button>
                    )}
                    
                    {isServing && (
                      <div className="absolute top-4 right-4 px-3 py-1 bg-green-500 text-white text-[10px] font-black rounded-full animate-pulse uppercase">
                        Active
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Section: Search (remains same) */}
        <div className="mb-6">
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Discover Businesses</h3>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by business name or category..."
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-transparent rounded-2xl shadow-sm focus:border-blue-600 outline-none transition-all font-medium text-gray-900 shadow-blue-900/5"
            />
          </div>
        </div>

        {/* Grid: Available Queues (Updated with Join/Leave Toggle) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQueues.length > 0 ? (
            filteredQueues.map((queue) => {
              const queueData = getQueueData(queue.id);
              const isJoined = !!queueData?.userEntry;
              const isServing = queueData?.userEntry?.status === 'serving';

              return (
                <div 
                  key={queue.id} 
                  className={`bg-white rounded-2xl border-2 p-6 flex flex-col transition-all shadow-sm ${
                    isJoined ? 'border-blue-100 bg-blue-50/10' : 'border-gray-100 hover:border-blue-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="font-black text-gray-900 text-lg">
                        {queue.business_name}
                      </h4>
                      <span className="inline-block mt-1 text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg uppercase">
                        {queue.category || 'General'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Wait Time</p>
                      <div className="flex items-center gap-1 text-gray-900 font-black">
                        <Clock className="w-3 h-3 text-blue-600" />
                        {(queue.items?.filter(i => i.status === 'waiting').length || 0) * (queue.average_service_time || 5)}m
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">In Line</p>
                      <div className="flex items-center gap-1 text-gray-900 font-black">
                        <Users className="w-3 h-3 text-purple-600" />
                        {queue.items?.filter(i => i.status === 'waiting' || i.status === 'serving').length || 0}
                      </div>
                    </div>
                  </div>

                  {isJoined ? (
                    <div className="flex gap-2">
                      <Link
                        href={`/user/queue/${queue.id}`}
                        className={`flex-1 py-3.5 rounded-xl font-black text-[10px] text-center transition-all active:scale-95 border-2 ${
                          isServing 
                            ? 'bg-green-500 text-white border-green-500' 
                            : 'bg-white text-blue-600 border-blue-600'
                        }`}
                      >
                        {isServing ? "VIEW TURN" : "VIEW POSITION"}
                      </Link>
                      
                      {/* Only allow leaving if NOT serving */}
                      {!isServing && (
                        <button
                          onClick={(e) => handleLeaveQueue(e, queue.id)}
                          className="px-4 py-3.5 bg-red-50 text-red-600 rounded-xl font-black text-[10px] border-2 border-red-100 hover:bg-red-100 transition-all"
                        >
                          LEAVE
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => queue.is_open && handleJoinQueue(queue.id)}
                      disabled={!queue.is_open}
                      className={`w-full py-3.5 rounded-xl font-black text-sm transition-all active:scale-95 ${
                        queue.is_open
                          ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-100"
                          : "bg-gray-100 text-gray-400 border-2 border-gray-200 cursor-not-allowed"
                      }`}
                    >
                      {queue.is_open ? "JOIN QUEUE" : "CLOSED"}
                    </button>
                  )}
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-20 text-center">
              <h4 className="text-gray-900 font-black text-xl">No businesses found</h4>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}