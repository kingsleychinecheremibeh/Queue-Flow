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
} from "lucide-react";

export default function BusinessDashboard() {
  const { user, logOut } = useAuth();
  const { getBusinessQueues } = useQueue();

  // Get this business's queues
  const businessQueues = user ? getBusinessQueues(user.id) : [];
  const totalPeople = businessQueues.reduce((sum, q) => sum + q.currentQueueLength, 0);
  const avgServiceTime = businessQueues.length > 0 
    ? Math.round(businessQueues.reduce((sum, q) => sum + q.averageServiceTime, 0) / businessQueues.length)
    : 0;

  const stats = [
    {
      label: "Active Queues",
      value: businessQueues.length.toString(),
      change: `${businessQueues.filter(q => q.isOpen).length} open`,
      icon: Users,
      color: "blue",
    },
    {
      label: "Total in Queue",
      value: totalPeople.toString(),
      change: "people waiting",
      icon: Users,
      color: "green",
    },
    {
      label: "Avg Service Time",
      value: `${avgServiceTime} min`,
      change: "across all queues",
      icon: Clock,
      color: "purple",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">QueueFlow</h1>
                <p className="text-xs text-gray-500">{user?.businessName}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-medium">
                    {user?.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">{user?.name}</span>
              </div>
              <button
                onClick={logOut}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Business Dashboard</h2>
          <p className="text-gray-600 mt-1">Manage your queue and view analytics</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Link
            href="/business/create-queue"
            className="bg-blue-600 text-white rounded-xl p-6 hover:bg-blue-700 transition-colors flex items-center justify-between"
          >
            <div>
              <h3 className="font-semibold text-lg">Create Queue</h3>
              <p className="text-blue-100 text-sm mt-1">Add a new queue</p>
            </div>
            <Plus className="w-8 h-8" />
          </Link>
          <Link
            href="/business/analytics"
            className="bg-purple-600 text-white rounded-xl p-6 hover:bg-purple-700 transition-colors"
          >
            <BarChart3 className="w-8 h-8 mb-3" />
            <h3 className="font-semibold text-lg">Analytics</h3>
            <p className="text-purple-100 text-sm mt-1">View detailed reports</p>
          </Link>
          <Link
            href="/business/settings"
            className="bg-gray-800 text-white rounded-xl p-6 hover:bg-gray-900 transition-colors"
          >
            <Settings className="w-8 h-8 mb-3" />
            <h3 className="font-semibold text-lg">Settings</h3>
            <p className="text-gray-300 text-sm mt-1">Configure your account</p>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const colorClasses = {
              blue: "bg-blue-100 text-blue-600",
              green: "bg-green-100 text-green-600",
              purple: "bg-purple-100 text-purple-600",
              orange: "bg-orange-100 text-orange-600",
            };
            return (
              <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[stat.color]}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Your Queues */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Queues</h3>
            {businessQueues.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No queues yet. Create your first queue!</p>
                <Link
                  href="/business/create-queue"
                  className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Create Queue
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {businessQueues.map((queue) => (
                  <Link
                    key={queue.id}
                    href={`/business/queue-management?queueId=${queue.id}`}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{queue.queueName || queue.businessName}</h4>
                      <p className="text-sm text-gray-600">{queue.category}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {queue.currentQueueLength} waiting
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {queue.averageServiceTime} min avg
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                      className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                        queue.isOpen
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Power className="w-4 h-4" />
                      {queue.isOpen ? 'Open' : 'Closed'}
                    </button>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Queue Summary */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-xs text-gray-600">Total Queues</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{businessQueues.length}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-xs text-gray-600">Open Queues</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{businessQueues.filter(q => q.isOpen).length}</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-xs text-gray-600">People Waiting</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">{totalPeople}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
