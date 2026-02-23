'use client';

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  TrendingUp,
  Users,
  Clock,
  LogOut,
  ArrowLeft,
  BarChart3,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const dailyData = [
  { day: "Mon", customers: 45, avgWait: 12 },
  { day: "Tue", customers: 52, avgWait: 15 },
  { day: "Wed", customers: 48, avgWait: 11 },
  { day: "Thu", customers: 61, avgWait: 18 },
  { day: "Fri", customers: 72, avgWait: 22 },
  { day: "Sat", customers: 68, avgWait: 20 },
  { day: "Sun", customers: 35, avgWait: 8 },
];

const hourlyData = [
  { hour: "9 AM", queue: 5 },
  { hour: "10 AM", queue: 8 },
  { hour: "11 AM", queue: 12 },
  { hour: "12 PM", queue: 15 },
  { hour: "1 PM", queue: 18 },
  { hour: "2 PM", queue: 22 },
  { hour: "3 PM", queue: 19 },
  { hour: "4 PM", queue: 14 },
  { hour: "5 PM", queue: 10 },
];

const monthlyData = [
  { month: "Jan", served: 890 },
  { month: "Feb", served: 1050 },
  { month: "Mar", served: 980 },
  { month: "Apr", served: 1150 },
  { month: "May", served: 1280 },
  { month: "Jun", served: 1420 },
];

export default function BusinessAnalytics() {
  const { user, logOut } = useAuth();
  const router = useRouter();

  const stats = [
    {
      label: "Total Served Today",
      value: "47",
      change: "+12% vs yesterday",
      icon: Users,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Avg. Wait Time",
      value: "15 min",
      change: "-2 min vs yesterday",
      icon: Clock,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Peak Hour",
      value: "2-3 PM",
      change: "22 customers",
      icon: TrendingUp,
      color: "bg-purple-100 text-purple-600",
    },
    {
      label: "This Month",
      value: "1,420",
      change: "+18% vs last month",
      icon: BarChart3,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/business/dashboard")}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Analytics</h1>
                  {user &&<p className="text-xs text-gray-500">{user?.businessName}</p>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>This year</option>
              </select> */}
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
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Performance Analytics</h2>
          <p className="text-gray-600 mt-1">Track your queue performance and customer insights</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
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

        {/* Charts */}
        <div className="space-y-6">
          {/* Customer Traffic */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Daily Customer Traffic</h3>
              <p className="text-sm text-gray-600">Number of customers served per day</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dailyData}>
                <defs>
                  <linearGradient id="colorCustomers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="customers"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorCustomers)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Average Wait Time */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Average Wait Time</h3>
                <p className="text-sm text-gray-600">Wait time trends by day</p>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="avgWait"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: "#10b981", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Hourly Queue Length */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Hourly Queue Pattern</h3>
                <p className="text-sm text-gray-600">Average queue length by hour</p>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="hour" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip />
                  <Bar dataKey="queue" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Served */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Monthly Performance</h3>
              <p className="text-sm text-gray-600">Total customers served per month</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Bar dataKey="served" fill="#f59e0b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">🎯 Key Insight</h3>
              <p className="text-blue-100 mb-4">
                Your busiest time is 2-3 PM with an average of 22 customers. Consider adding more
                staff during this period.
              </p>
              <button className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                View Recommendations
              </button>
            </div>

            <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">📈 Performance</h3>
              <p className="text-green-100 mb-4">
                Great job! You&#39;ve served 18% more customers this month compared to last month.
              </p>
              <button className="px-4 py-2 bg-white text-green-600 rounded-lg font-medium hover:bg-green-50 transition-colors">
                Download Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
