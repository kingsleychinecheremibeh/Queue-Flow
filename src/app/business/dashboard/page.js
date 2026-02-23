'use client';

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useQueue } from "@/context/QueueContext";
import {
  Users,
  Clock,
  TrendingUp,
  Bell,
  LogOut,
  LayoutDashboard,
  BarChart3,
  Settings,
  AlertCircle,
} from "lucide-react";

export default function BusinessDashboard() {
  const { user, logOut } = useAuth();
  const { queues } = useQueue();

  // Get business's queue (in a real app, filter by businessId)
  const businessQueue = queues[0]; // Mock - first queue

  const stats = [
    {
      label: "Current Queue",
      value: businessQueue.currentQueueLength.toString(),
      change: "+3 from last hour",
      icon: Users,
      color: "blue",
    },
    {
      label: "Avg. Wait Time",
      value: `${businessQueue.averageServiceTime} min`,
      change: "-2 min from yesterday",
      icon: Clock,
      color: "green",
    },
    {
      label: "Served Today",
      value: "47",
      change: "+12% from yesterday",
      icon: TrendingUp,
      color: "purple",
    },
    {
      label: "Active Alerts",
      value: "2",
      change: "Requires attention",
      icon: AlertCircle,
      color: "orange",
    },
  ];

  const recentActivity = [
    { user: "Kingsley Ibeh", action: "Completed service", time: "2 min ago" },
    { user: "Micheal Olawoye", action: "Called for service", time: "5 min ago" },
    { user: "Mike Johnson", action: "Joined queue", time: "8 min ago" },
    { user: "Genevieve Okafor", action: "Joined queue", time: "12 min ago" },
  ];

  const notifications = [
    {
      type: "warning",
      message: "Queue length above average for this time",
      time: "5 min ago",
    },
    {
      type: "info",
      message: "Peak hours starting soon (2:00 PM - 4:00 PM)",
      time: "15 min ago",
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
                {user &&<p className="text-xs text-gray-500">{user?.businessName}</p>}
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
            href="/business/queue-management"
            className="bg-blue-600 text-white rounded-xl p-6 hover:bg-blue-700 transition-colors"
          >
            <Users className="w-8 h-8 mb-3" />
            <h3 className="font-semibold text-lg">Manage Queue</h3>
            <p className="text-blue-100 text-sm mt-1">Call next customer, view queue</p>
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
            <p className="text-gray-300 text-sm mt-1">Configure your queue</p>
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
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                      <p className="text-sm text-gray-600">{activity.action}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
            <div className="space-y-4">
              {notifications.map((notification, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${
                    notification.type === "warning"
                      ? "bg-orange-50 border-orange-500"
                      : "bg-blue-50 border-blue-500"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {notification.type === "warning" ? (
                      <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Bell className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="text-sm text-gray-900">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
