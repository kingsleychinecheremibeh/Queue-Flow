"use client";

import Link from "next/link";
import { 
  Clock, Users, Smartphone, BarChart3, CheckCircle, Zap, 
  Download, Scan, Ticket, Coffee, ArrowRight
} from "lucide-react";

const features = [
  { icon: Smartphone, title: "Join Remotely", description: "Join any queue from anywhere using your smartphone." },
  { icon: Clock, title: "Real-Time Updates", description: "Get live updates on your queue position instantly." },
  { icon: Zap, title: "Smart Calculation", description: "Predict wait times accurately with our smart algorithm." },
  { icon: BarChart3, title: "Business Analytics", description: "Dashboard with insights, trends, and performance metrics." },
  { icon: CheckCircle, title: "Simple & Intuitive", description: "Designed for both customers and business owners." },
  { icon: Users, title: "Multi-Industry", description: "Perfect for healthcare, restaurant, retail, and government." },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-400 font-sans selection:bg-blue-600 selection:text-white">
      
      {/* 1. Header Navigation */}
      <nav className="border-b border-zinc-900 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 border-2 border-blue-600 flex items-center justify-center text-blue-600 font-bold text-sm">Q</div>
            <span className="text-white font-bold tracking-tighter text-xl">QueueFlow</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-xs font-bold uppercase tracking-widest hover:text-blue-500 transition-colors">Sign In</Link>
            <Link href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-widest hover:bg-blue-700 transition-all">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section - Sharp & Bold */}
      <section className="relative pt-24 pb-20 px-6 border-b border-zinc-900 overflow-hidden">
        {/* Subtle Grid Background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, size: '40px 40px', backgroundSize: '40px 40px' }} 
        />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-blue-900/50 bg-blue-900/10 text-blue-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-8 rounded">
            <Download size={12} />
            PWA Ready for Live Notifications
          </div>

          <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.9]">
            SKIP THE LINE.<br />
            <span className="text-blue-600">OWN YOUR TIME.</span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-500 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
            The technical solution for queue management. Join remotely, track live, and eliminate the wait.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="w-full sm:w-auto px-10 py-4 bg-blue-600 text-white font-bold uppercase tracking-widest text-sm hover:bg-blue-700 transition-all active:scale-95">
              Get Started Now
            </Link>
            <Link href="/business-register" className="w-full sm:w-auto px-10 py-4 border border-zinc-800 text-white font-bold uppercase tracking-widest text-sm hover:bg-zinc-900 transition-all">
              For Businesses
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Stats Section - No Icons, Just Data */}
      <section className="border-b border-zinc-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-900">
          <Stat number="150k+" label="Minutes Saved" />
          <Stat number="1,200+" label="Active Vendors" />
          <Stat number="99.9%" label="Uptime" />
        </div>
      </section>

      {/* 4. How It Works - High Contrast */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="mb-20">
          <h2 className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.4em] mb-4">The Workflow</h2>
          <h3 className="text-4xl font-black text-white tracking-tighter">THREE STEPS TO FREEDOM</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <Step icon={Scan} step="01" title="SCAN" desc="Locate a business QR or search the directory." />
          <Step icon={Ticket} step="02" title="JOIN" desc="Secure your digital ticket instantly. No paper." />
          <Step icon={Coffee} step="03" title="WAIT" desc="Relax anywhere. We alert you when it's time." />
        </div>
      </section>

      {/* 5. Features Grid - Dark Tiles */}
      <section className="bg-black border-y border-zinc-900 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-900 border border-zinc-900">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 border-t border-zinc-900 pt-12">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 border border-blue-600 flex items-center justify-center text-blue-600 font-bold text-[10px]">Q</div>
            <span className="font-bold text-white text-sm tracking-tight">QueueFlow</span>
          </div>
          <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
            &copy; {new Date().getFullYear()} QueueFlow. Built for efficiency.
          </p>
        </div>
      </footer>
    </div>
  );
}

function Step({ icon: Icon, step, title, desc }) {
  return (
    <div className="group">
      <div className="text-blue-600 font-black text-6xl mb-6 opacity-20 group-hover:opacity-100 transition-opacity duration-500">{step}</div>
      <h4 className="text-white font-bold text-xl mb-4 tracking-tight flex items-center gap-3">
        <Icon size={20} className="text-blue-600" /> {title}
      </h4>
      <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="bg-[#0a0a0a] p-10 hover:bg-[#0f0f0f] transition-colors group">
      <Icon className="text-zinc-700 group-hover:text-blue-600 mb-6 transition-colors" size={32} />
      <h3 className="text-white font-bold text-lg mb-3 tracking-tight">{title}</h3>
      <p className="text-zinc-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function Stat({ number, label }) {
  return (
    <div className="py-12 md:py-16 text-center">
      <h3 className="text-5xl font-black text-white mb-2 tracking-tighter">{number}</h3>
      <p className="text-zinc-600 font-bold uppercase tracking-[0.3em] text-[10px]">{label}</p>
    </div>
  );
}