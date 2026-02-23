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
  Trash2 // Added Trash icon
} from "lucide-react";

export default function BusinessDashboard() {
  const { user, logOut } = useAuth();
  // Destructure archiveQueue from your context
  const { queues, toggleQueueStatus, archiveQueue } = useQueue();
  
  const businessQueues = queues.filter(q => q.business_id === user?.id);
  
  const totalPeople = businessQueues.reduce((sum, q) => 
    sum + (q.items?.filter(i => i.status === 'waiting' || i.status === 'serving').length || 0), 0
  );
  
  const openQueuesCount = businessQueues.filter(q => q.is_open).length;
  
  const avgServiceTime = businessQueues.length > 0 
    ? Math.round(businessQueues.reduce((sum, q) => sum + (q.average_service_time || 0), 0) / businessQueues.length)
    : 0;

  const stats = [
    { label: "Active Queues", value: businessQueues.length.toString(), change: `${openQueuesCount} currently open`, icon: Activity, color: "blue" },
    { label: "Currently In Line", value: totalPeople.toString(), change: "active customers", icon: Users, color: "green" },
    { label: "Avg Service Time", value: `${avgServiceTime} min`, change: "per customer", icon: Clock, color: "purple" },
  ];

  const handleStatusToggle = async (e, queueId, currentStatus) => {
    e.preventDefault(); 
    if (toggleQueueStatus) {
      await toggleQueueStatus(queueId, !currentStatus);
    }
  };

  // NEW: Handle Archive Action
  const handleArchive = async (e, queueId, queueName) => {
    e.preventDefault(); // Stop Link navigation
    const confirmArchive = window.confirm(`Archive "${queueName}"? It will be removed from your active dashboard and users will no longer see it.`);
    if (confirmArchive && archiveQueue) {
      await archiveQueue(queueId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 leading-tight">QueueFlow</h1>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-wider italic">
                  {user?.full_name || 'Business Account'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="h-8 w-px bg-gray-200 mx-2"></div>
              <button onClick={logOut} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Dashboard</h2>
            <p className="text-gray-500 font-medium italic">Monitoring your business pulse.</p>
          </div>
          <Link href="/business/create-queue" className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95">
            <Plus className="w-5 h-5" />
            Create New Queue
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const colorClasses = {
              blue: "bg-blue-50 text-blue-600 border-blue-100",
              green: "bg-green-50 text-green-600 border-green-100",
              purple: "bg-purple-50 text-purple-600 border-purple-100",
            };
            return (
              <div key={stat.label} className="bg-white rounded-2xl border-2 border-gray-50 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[stat.color]}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-3xl font-black text-gray-900 mt-1">{stat.value}</p>
                <p className="text-xs font-bold text-blue-500 mt-2 flex items-center gap-1">{stat.change}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xl font-black text-gray-900 mb-4">Live Queues</h3>
            {businessQueues.length === 0 ? (
              <div className="bg-white rounded-3xl border-2 border-dashed border-gray-200 p-12 text-center">
                <p className="text-gray-400 font-bold mb-4">No queues active right now.</p>
                <Link href="/business/create-queue" className="bg-slate-900 text-white px-6 py-2 rounded-xl text-sm font-bold">
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {businessQueues.map((queue) => (
                  <Link
                    key={queue.id}
                    href={`/business/queue-management?queueId=${queue.id}`}
                    className="group bg-white p-6 rounded-3xl border-2 border-transparent hover:border-blue-600 shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-black text-xl text-gray-900">{queue.queue_name}</h4>
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded-lg">
                          {queue.category || 'General'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500 font-bold">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-blue-600" />
                          {queue.items?.filter(i => i.status === 'waiting' || i.status === 'serving').length || 0} in line
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-purple-600" />
                          {queue.average_service_time || 5}m service
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {/* ARCHIVE BUTTON */}
                      <button
                        onClick={(e) => handleArchive(e, queue.id, queue.queue_name)}
                        className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        title="Archive Queue"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>

                      {/* TOGGLE STATUS BUTTON */}
                      <button
                        onClick={(e) => handleStatusToggle(e, queue.id, queue.is_open)}
                        className={`px-6 py-2.5 rounded-2xl font-black text-xs flex items-center gap-2 transition-all ${
                          queue.is_open
                            ? 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white'
                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white'
                        }`}
                      >
                        <Power className="w-4 h-4" />
                        {queue.is_open ? 'CLOSE QUEUE' : 'OPEN QUEUE'}
                      </button>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-black text-gray-900 mb-4">Insights</h3>
            <div className="grid gap-3">
              <Link href="/business/analytics" className="flex items-center gap-4 p-5 bg-white rounded-3xl border-2 border-gray-50 hover:border-blue-100 transition-all group">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-black text-gray-900">Analytics</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Growth & Traffic</p>
                </div>
              </Link>
              <Link href="/business/settings" className="flex items-center gap-4 p-5 bg-white rounded-3xl border-2 border-gray-50 hover:border-blue-100 transition-all group">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-all">
                  <Settings className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-black text-gray-900">Settings</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Store Profile</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}