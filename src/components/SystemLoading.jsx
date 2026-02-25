'use client';
import { Activity, Shield, Cpu } from "lucide-react";

export default function SystemLoading() {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#0a0a0a] flex flex-col items-center justify-center p-6">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative flex flex-col items-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-blue-600/20 rounded-full animate-ping scale-150 opacity-20" />
          <div className="relative w-20 h-20 bg-[#0f0f0f] border border-blue-900/50 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.1)]">
            <Activity className="w-10 h-10 text-blue-500 animate-[pulse_1.5s_ease-in-out_infinite]" />
          </div>
        </div>

        <div className="space-y-2 text-center">
          <h2 className="text-white font-black text-[10px] uppercase tracking-[0.5em] animate-pulse">
            Establishing_Link
          </h2>
          <div className="h-[2px] w-24 bg-zinc-900 mx-auto overflow-hidden relative">
            <div className="absolute inset-0 bg-blue-600 w-full animate-[loading_2s_infinite]" />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}