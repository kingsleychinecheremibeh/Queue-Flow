'use client';

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useQueue } from "@/context/QueueContext";
import {
  Users,
  Clock,
  Plus,
  Bell,
  LogOut,
  LayoutDashboard,
  BarChart3,
  Settings,
  Power,
  Activity,
  Trash2
} from "lucide-react";

export default function BusinessDashboard() {
  const { user, logOut } = useAuth();
  // YOUR LOGIC: Destructure archiveQueue from context
  const { queues, toggleQueueStatus, archiveQueue } = useQueue();
  
  // YOUR LOGIC: Filter and calculations
  const businessQueues = queues.filter(q => q.business_id === user?.id);
  
  const totalPeople = businessQueues.reduce((sum, q) => 
    sum + (q.items?.filter(i => i.status === 'waiting' || i.status === 'serving').length || 0), 0
  );
  
  const openQueuesCount = businessQueues.filter(q => q.is_open).length;
  
  const avgServiceTime = businessQueues.length > 0 
    ? Math.round(businessQueues.reduce((sum, q) => sum + (q.average_service_time || 0), 0) / businessQueues.length)
    : 0;

  // YOUR STATS ARRAY
  const stats = [
    { label: "Active Queues", value: businessQueues.length.toString(), change: `${openQueuesCount} currently open`, icon: Activity, color: "text-blue-500" },
    { label: "Currently In Line", value: totalPeople.toString(), change: "active customers", icon: Users, color: "text-emerald-500" },
    { label: "Avg Service Time", value: `${avgServiceTime} min`, change: "per customer", icon: Clock, color: "text-amber-500" },
  ];

  // YOUR HANDLERS (UNCHANGED)
  const handleStatusToggle = async (e, queueId, currentStatus) => {
    e.preventDefault(); 
    if (toggleQueueStatus) {
      await toggleQueueStatus(queueId, !currentStatus);
    }
  };

  const handleArchive = async (e, queueId, queueName) => {
    e.preventDefault();
    const confirmArchive = window.confirm(`Archive "${queueName}"? It will be removed from your active dashboard and users will no longer see it.`);
    if (confirmArchive && archiveQueue) {
      await archiveQueue(queueId);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-400 font-sans selection:bg-blue-600">
      {/* HEADER SECTION */}
      <header className="border-b border-zinc-900 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 border-2 border-blue-600 flex items-center justify-center text-blue-600 font-bold text-sm">Q</div>
            <div className="h-4 w-px bg-zinc-800"></div>
            <div>
              <h1 className="text-sm font-black text-white leading-none">QueueFlow</h1>
              <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest mt-1 italic">
                {user?.full_name || 'Business Account'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="relative p-2 text-zinc-500 hover:text-white transition-colors">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-600 rounded-full shadow-[0_0_8px_rgba(220,38,38,0.5)]"></span>
            </button>
            <div className="h-4 w-px bg-zinc-800 mx-2"></div>
            <button onClick={logOut} className="flex items-center gap-2 px-3 py-1.5 border border-zinc-800 hover:border-red-900/50 hover:bg-red-900/10 text-[10px] font-bold uppercase tracking-widest transition-all">
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* WELCOME SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-4xl font-black text-white tracking-tighter">DASHBOARD</h2>
            <p className="text-zinc-500 text-sm font-medium mt-1">Monitoring your business pulse.</p>
          </div>
          <Link href="/business/create-queue" className="bg-blue-600 text-white px-6 py-3 rounded text-xs font-bold uppercase tracking-[0.2em] hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-blue-900/20">
            <Plus size={16} /> Create New Queue
          </Link>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-900 border border-zinc-900 mb-12">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-[#0a0a0a] p-8">
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{stat.label}</span>
                <stat.icon size={16} className={stat.color} />
              </div>
              <div className="text-4xl font-black text-white tracking-tighter mb-1">{stat.value}</div>
              <div className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter">{stat.change}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* MAIN COLUMN: QUEUES */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-6 border-l-2 border-blue-600 pl-3">Live Queues</h3>
            
            {businessQueues.length === 0 ? (
              <div className="border border-dashed border-zinc-800 p-16 text-center rounded-lg">
                <p className="text-xs text-zinc-600 font-bold uppercase tracking-widest mb-6">No queues active right now.</p>
                <Link href="/business/create-queue" className="bg-white text-black px-6 py-2 rounded text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all">
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {businessQueues.map((queue) => (
                  <div key={queue.id} className="group bg-[#0f0f0f] border border-zinc-900 hover:border-blue-900 transition-all overflow-hidden rounded-lg">
                    <div className="flex flex-col md:flex-row items-center p-6 gap-6">
                      <Link 
                        href={`/business/queue-management?queueId=${queue.id}`}
                        className="flex-1 w-full"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-bold text-white tracking-tight group-hover:text-blue-500 transition-colors">{queue.queue_name}</h4>
                          <span className="text-[9px] font-bold px-2 py-0.5 bg-blue-600/10 text-blue-500 border border-blue-600/20 uppercase tracking-widest rounded">
                            {queue.category || 'General'}
                          </span>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2 text-[11px] font-bold">
                            <Users size={12} className="text-blue-500" />
                            <span className="text-zinc-300">{queue.items?.filter(i => i.status === 'waiting' || i.status === 'serving').length || 0}</span>
                            <span className="text-zinc-600 uppercase tracking-tighter">In line</span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] font-bold">
                            <Clock size={12} className="text-amber-500" />
                            <span className="text-zinc-300">{queue.average_service_time || 5}m</span>
                            <span className="text-zinc-600 uppercase tracking-tighter">Service</span>
                          </div>
                        </div>
                      </Link>

                      <div className="flex items-center gap-3 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-zinc-900">
                        <button
                          onClick={(e) => handleArchive(e, queue.id, queue.queue_name)}
                          className="p-2.5 border border-zinc-800 text-zinc-600 hover:text-red-500 hover:border-red-900 transition-all rounded"
                          title="Archive Queue"
                        >
                          <Trash2 size={18} />
                        </button>
                        <button
                          onClick={(e) => handleStatusToggle(e, queue.id, queue.is_open)}
                          className={`flex-1 md:flex-none px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest border transition-all rounded ${
                            queue.is_open 
                            ? 'border-red-900/50 bg-red-900/10 text-red-500 hover:bg-red-600 hover:text-white' 
                            : 'border-emerald-900/50 bg-emerald-900/10 text-emerald-500 hover:bg-emerald-600 hover:text-white'
                          }`}
                        >
                          <Power size={14} className="inline mr-2" />
                          {queue.is_open ? 'Close Queue' : 'Open Queue'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SIDEBAR: INSIGHTS */}
          <div className="space-y-10">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                Insights <span className="h-px flex-1 bg-zinc-900"></span>
              </h3>
              <div className="grid gap-2">
                <Link href="/business/analytics" className="flex items-center gap-4 p-4 border border-zinc-900 hover:border-blue-900 bg-[#0f0f0f] transition-all group rounded-lg">
                  <div className="w-10 h-10 bg-zinc-900 rounded flex items-center justify-center text-zinc-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <BarChart3 size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white uppercase tracking-widest">Analytics</p>
                    <p className="text-[9px] font-bold text-zinc-600 uppercase">Growth & Traffic</p>
                  </div>
                </Link>
                <Link href="/business/settings" className="flex items-center gap-4 p-4 border border-zinc-900 hover:border-blue-900 bg-[#0f0f0f] transition-all group rounded-lg">
                  <div className="w-10 h-10 bg-zinc-900 rounded flex items-center justify-center text-zinc-500 group-hover:bg-white group-hover:text-black transition-all">
                    <Settings size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white uppercase tracking-widest">Settings</p>
                    <p className="text-[9px] font-bold text-zinc-600 uppercase">Store Profile</p>
                  </div>
                </Link>
              </div>
            </div>

            <div className="p-6 bg-blue-600/5 border border-blue-600/10 rounded-lg">
              <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">Live Status</h4>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                <span className="text-[10px] font-bold text-white uppercase tracking-widest">System Operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}