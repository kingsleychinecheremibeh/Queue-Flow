'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import {
  TrendingUp, Users, Clock, ArrowLeft,
  BarChart3, Download, Lightbulb, Loader2, Zap, ShieldCheck, Activity
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar
} from "recharts";

export default function BusinessAnalytics() {
  const { user } = useAuth();
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
        
        const waitTimes = completed
          .filter(e => e.called_at && e.created_at)
          .map(e => (new Date(e.called_at) - new Date(e.created_at)) / 60000);
        
        const avgWait = waitTimes.length 
          ? Math.round(waitTimes.reduce((a, b) => a + b, 0) / waitTimes.length) 
          : 0;

        const rate = entries.length ? Math.round((completed.length / entries.length) * 100) : 0;

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

        const hourlyGroup = entries.reduce((acc, entry) => {
          const hour = new Date(entry.created_at).getHours();
          acc[hour] = (acc[hour] || 0) + 1;
          return acc;
        }, {});

        const formattedHourly = Array.from({ length: 24 }, (_, i) => ({
          hour: i === 0 ? '12AM' : i < 12 ? `${i}AM` : i === 12 ? '12PM' : `${i - 12}PM`,
          count: hourlyGroup[i] || 0,
          rawHour: i
        })).filter(h => h.count > 0 || (h.rawHour >= 8 && h.rawHour <= 20));

        const peakDay = [...last7Days].sort((a, b) => b.customers - a.customers)[0]?.day || "---";

        setChartData(last7Days);
        setHourlyData(formattedHourly);
        setStats([
          { label: "Throughput", value: completed.length.toString(), change: "Units_Processed", icon: Users, color: "text-blue-500 bg-blue-500/10" },
          { label: "Latency_Avg", value: `${avgWait}m`, change: "Processing_Speed", icon: Clock, color: "text-emerald-500 bg-emerald-500/10" },
          { label: "Yield_Rate", value: `${rate}%`, change: "Efficiency", icon: Zap, color: "text-amber-500 bg-amber-500/10" },
          { label: "Peak_Period", value: peakDay, change: "Max_Load", icon: TrendingUp, color: "text-purple-500 bg-purple-500/10" },
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a]">
      <Activity className="w-10 h-10 text-blue-600 animate-pulse mb-4" />
      <p className="text-[10px] font-black text-zinc-500 tracking-[0.4em] uppercase">Compiling Metrics...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-400 font-sans selection:bg-blue-600 pb-12">
      {/* Header */}
      <header className="bg-[#0a0a0a]/80 backdrop-blur-md border-b border-zinc-900 sticky top-0 z-50 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button onClick={() => router.push("/business/dashboard")} className="text-zinc-600 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <h1 className="text-xs font-black text-white uppercase tracking-[0.3em]">
              Intelligence Center
            </h1>
          </div>
        </div>
        <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded font-black text-[9px] tracking-widest hover:bg-blue-700 transition-all">
          <Download size={14} /> EXPORT DATA
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Top Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-[#0f0f0f] rounded-lg p-6 border border-zinc-900 hover:border-zinc-800 transition-colors">
              <div className={`${stat.color} w-10 h-10 rounded flex items-center justify-center mb-6`}>
                <stat.icon size={18} />
              </div>
              <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em]">{stat.label}</p>
              <p className="text-3xl font-black text-white mt-1 italic tracking-tighter">{stat.value}</p>
              <p className="text-[9px] font-bold mt-3 text-blue-600 uppercase tracking-tighter border-t border-zinc-900 pt-3">{stat.change}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Weekly Volume */}
          <div className="bg-[#0f0f0f] rounded-lg p-8 border border-zinc-900">
            <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-8">Load Distribution Weekly</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorWave" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#18181b" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#52525b', fontSize: 10, fontWeight: 800}} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f0f0f', border: '1px solid #27272a', borderRadius: '4px' }}
                    itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="customers" stroke="#3b82f6" strokeWidth={3} fill="url(#colorWave)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Hourly Traffic */}
          <div className="bg-[#0f0f0f] rounded-lg p-8 border border-zinc-900">
            <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-8">Load Distribution Hourly</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#18181b" />
                  <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{fill: '#52525b', fontSize: 9, fontWeight: 800}} />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{fill: '#18181b'}} 
                    contentStyle={{ backgroundColor: '#0f0f0f', border: '1px solid #27272a', borderRadius: '4px' }}
                  />
                  <Bar dataKey="count" fill="#6366f1" radius={[2, 2, 0, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* System Advisory (AI Insight) */}
        <div className="bg-blue-600 rounded-lg p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-[0_0_40px_rgba(37,99,235,0.2)]">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <ShieldCheck size={120} />
          </div>
          <div className="flex items-start gap-8 relative z-10">
            <div className="bg-white/10 p-5 rounded backdrop-blur-sm border border-white/20">
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
            <div>
              <h4 className="text-2xl font-black tracking-tighter uppercase italic">System Advisory</h4>
              <p className="text-blue-100 text-[13px] max-w-xl leading-relaxed mt-2 font-medium">
                Detected peak operational load at <span className="font-black text-white underline">{hourlyData.sort((a,b)=>b.count-a.count)[0]?.hour}</span>. 
                Optimization recommended: Scaling active service nodes between 12 PM and 2 PM to resolve current 
                latency levels ({stats[1]?.value}).
              </p>
            </div>
          </div>
          <button className="px-10 py-4 bg-white text-blue-600 rounded font-black text-[10px] tracking-[0.2em] hover:bg-zinc-100 transition-all whitespace-nowrap relative z-10 uppercase">
            Analyze Heatmap
          </button>
        </div>
      </main>
    </div>
  );
}