'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import {
  TrendingUp, Users, Clock, LogOut, ArrowLeft,
  BarChart3, Download, Lightbulb, Loader2, Zap
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar
} from "recharts";

export default function BusinessAnalytics() {
  const { user, logOut } = useAuth();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [hourlyData, setHourlyData] = useState([]);
  const [stats, setStats] = useState([]);

  const fetchRealAnalytics = useCallback(async () => {
    if (!user?.id) return;
    try {
      const { data: entries, error } = await supabase
        .from('queue_entries')
        .select('*')
        .eq('business_id', user.id);

      if (error) throw error;

      if (entries) {
        const completed = entries.filter(e => e.status === 'completed');
        
        // --- 1. CORE METRICS ---
        const waitTimes = completed
          .filter(e => e.called_at && e.created_at)
          .map(e => (new Date(e.called_at) - new Date(e.created_at)) / 60000);
        
        const avgWait = waitTimes.length 
          ? Math.round(waitTimes.reduce((a, b) => a + b, 0) / waitTimes.length) 
          : 0;

        const rate = entries.length ? Math.round((completed.length / entries.length) * 100) : 0;

        // --- 2. WEEKLY TREND (Trailing 7 Days) ---
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const weeklyGroup = entries.reduce((acc, entry) => {
          const day = dayNames[new Date(entry.created_at).getDay()];
          acc[day] = (acc[day] || 0) + 1;
          return acc;
        }, {});

        const todayIdx = new Date().getDay();
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
          const idx = (todayIdx - i + 7) % 7;
          const d = dayNames[idx];
          last7Days.push({ day: d, customers: weeklyGroup[d] || 0 });
        }

        // --- 3. HOURLY HEATMAP (24h Distribution) ---
        const hourlyGroup = entries.reduce((acc, entry) => {
          const hour = new Date(entry.created_at).getHours();
          acc[hour] = (acc[hour] || 0) + 1;
          return acc;
        }, {});

        const formattedHourly = Array.from({ length: 24 }, (_, i) => ({
          hour: i === 0 ? '12AM' : i < 12 ? `${i}AM` : i === 12 ? '12PM' : `${i - 12}PM`,
          count: hourlyGroup[i] || 0,
          rawHour: i
        })).filter(h => h.count > 0 || (h.rawHour >= 8 && h.rawHour <= 20)); // Focus on business hours

        const peakDay = [...last7Days].sort((a, b) => b.customers - a.customers)[0]?.day || "---";

        setChartData(last7Days);
        setHourlyData(formattedHourly);
        setStats([
          { label: "Total Served", value: completed.length.toString(), change: "Lifetime", icon: Users, color: "bg-blue-50 text-blue-600" },
          { label: "Avg. Wait Time", value: `${avgWait}m`, change: "Queue Speed", icon: Clock, color: "bg-green-50 text-green-600" },
          { label: "Success Rate", value: `${rate}%`, change: "Completion", icon: Zap, color: "bg-orange-50 text-orange-600" },
          { label: "Peak Day", value: peakDay, change: "Highest Traffic", icon: TrendingUp, color: "bg-purple-50 text-purple-600" },
        ]);
      }
    } catch (err) {
      console.error("Analytics Error:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchRealAnalytics();
    const channel = supabase.channel('analytics-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'queue_entries', filter: `business_id=eq.${user?.id}` }, 
      () => fetchRealAnalytics()).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user?.id, fetchRealAnalytics]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/business/dashboard")} className="p-2 text-gray-400 hover:bg-gray-100 rounded-xl transition-all">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" /> Intelligence
          </h1>
        </div>
        <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-black hover:bg-slate-800 transition-all">
          <Download className="w-4 h-4" /> EXPORT
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Top Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <div className={`${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-gray-900 mt-1">{stat.value}</p>
              <p className="text-[10px] font-bold mt-2 text-blue-500 uppercase italic">{stat.change}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Weekly Area Chart */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Weekly Volume</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorWave" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} />
                  <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                  <Area type="monotone" dataKey="customers" stroke="#3b82f6" strokeWidth={3} fill="url(#colorWave)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Hourly Bar Chart */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Traffic by Hour</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 600}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '15px', border: 'none' }} />
                  <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* AI Insight Box */}
        <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-indigo-100">
          <div className="flex items-start gap-5">
            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
              <Lightbulb className="w-8 h-8 text-yellow-300" />
            </div>
            <div>
              <h4 className="text-xl font-black tracking-tight">Staffing Recommendation</h4>
              <p className="text-indigo-100 text-sm max-w-xl leading-relaxed mt-1">
                Based on your peak hour traffic ({hourlyData.sort((a,b)=>b.count-a.count)[0]?.hour}), 
                we suggest increasing active service points between 12 PM and 2 PM to reduce your 
                average wait time of {stats[1]?.value}.
              </p>
            </div>
          </div>
          <button className="px-8 py-4 bg-white text-indigo-600 rounded-2xl font-black text-sm hover:scale-105 transition-all whitespace-nowrap">
            VIEW HEATMAP
          </button>
        </div>
      </main>
    </div>
  );
}