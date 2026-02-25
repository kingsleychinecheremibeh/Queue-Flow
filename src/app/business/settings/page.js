"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowLeft, Save, Trash2, ShieldCheck, Bell, Globe, Moon, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();

  // YOUR LOGIC: State preserved exactly as provided
  const [businessInfo, setBusinessInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    logo: null,
  });

  const [accountSettings, setAccountSettings] = useState({
    twoFactor: false,
    notifications: true,
  });

  const [preferences, setPreferences] = useState({
    darkMode: false,
    language: "English",
  });

  const [sections, setSections] = useState({
    business: true,
    account: false,
    preferences: false,
    danger: false,
  });

  const [toastVisible, setToastVisible] = useState(false);

  // YOUR HANDLERS: Functionality remains identical
  const toggleSection = (section) => setSections({ ...sections, [section]: !sections[section] });

  const handleBusinessChange = (e) =>
    setBusinessInfo({ ...businessInfo, [e.target.name]: e.target.value });

  const handleAccountToggle = (field) =>
    setAccountSettings({ ...accountSettings, [field]: !accountSettings[field] });

  const handlePreferenceToggle = (field) =>
    setPreferences({ ...preferences, [field]: !preferences[field] });

  const handleLogoUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setBusinessInfo({ ...businessInfo, logo: URL.createObjectURL(e.target.files[0]) });
    }
  };

  const handleSave = () => {
    console.log("Saved settings (mock):", { businessInfo, accountSettings, preferences });
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure? This action cannot be undone!")) {
      console.log("Account deleted (mock)");
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 3000);
    }
  };

  // TECHNICAL SKIN: Reusable Styles
  const sectionContainer = "bg-[#0f0f0f] border border-zinc-900 rounded mb-4 overflow-hidden transition-all";
  const labelText = "text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2 block";
  const inputStyle = "w-full bg-[#111111] border border-zinc-800 rounded p-3 text-sm text-white focus:border-blue-600 outline-none transition-all placeholder:text-zinc-800 font-bold";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-400 font-sans p-6 md:p-12 relative selection:bg-blue-600">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-6">
            <button
              onClick={() => router.push("/business/dashboard")}
              className="p-2 border border-zinc-900 text-zinc-500 hover:text-white hover:bg-zinc-900 rounded transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">System Settings</h1>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.3em] mt-1">System Configuration v1.0.4</p>
            </div>
          </div>
          <button
            onClick={handleSave}
            className="hidden md:flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-900/20"
          >
            <Save size={16} />
            Save Changes
          </button>
        </div>

        <div className="space-y-4">
          {/* Business Info Section */}
          <div className={sectionContainer}>
            <div 
              className="p-6 flex justify-between items-center cursor-pointer hover:bg-zinc-900/50 transition-colors" 
              onClick={() => toggleSection("business")}
            >
              <div className="flex items-center gap-4">
                <ShieldCheck className={sections.business ? "text-blue-500" : "text-zinc-700"} size={20} />
                <h2 className={`font-black text-[11px] uppercase tracking-[0.3em] ${sections.business ? "text-white" : "text-zinc-500"}`}>
                  Business Registry
                </h2>
              </div>
              {sections.business ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            {sections.business && (
              <div className="p-8 pt-0 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
                <div className="space-y-4">
                  <div>
                    <label className={labelText}>Designation</label>
                    <input name="name" value={businessInfo.name} onChange={handleBusinessChange} placeholder="Company Name" className={inputStyle} />
                  </div>
                  <div>
                    <label className={labelText}>Contact Email</label>
                    <input name="email" value={businessInfo.email} onChange={handleBusinessChange} placeholder="admin@node.com" className={inputStyle} />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className={labelText}>Comm Line</label>
                    <input name="phone" value={businessInfo.phone} onChange={handleBusinessChange} placeholder="+1 (000) 000-0000" className={inputStyle} />
                  </div>
                  <div>
                    <label className={labelText}>Physical Address</label>
                    <input name="address" value={businessInfo.address} onChange={handleBusinessChange} placeholder="Sector 7, Grid B" className={inputStyle} />
                  </div>
                </div>
                <div className="md:col-span-2 pt-4 border-t border-zinc-900">
                   <label className={labelText}>Identity_Mark (Logo)</label>
                   <div className="flex items-center gap-6">
                      <div className="relative group w-24 h-24 bg-[#111111] border-2 border-dashed border-zinc-800 rounded flex items-center justify-center overflow-hidden transition-colors hover:border-blue-600">
                        {businessInfo.logo ? (
                          <Image src={businessInfo.logo} alt="Preview" fill className="object-cover" />
                        ) : (
                          <span className="text-zinc-800 font-black text-xs">NO DATA</span>
                        )}
                        <input type="file" accept="image/*" onChange={handleLogoUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>
                      <p className="text-[9px] text-zinc-600 font-bold leading-relaxed uppercase tracking-widest">
                        Upload vector or high-res <br/> identity assets. Max 2MB.
                      </p>
                   </div>
                </div>
              </div>
            )}
          </div>

          {/* Account Settings Section */}
          <div className={sectionContainer}>
            <div className="p-6 flex justify-between items-center cursor-pointer hover:bg-zinc-900/50" onClick={() => toggleSection("account")}>
              <div className="flex items-center gap-4">
                <Bell className={sections.account ? "text-blue-500" : "text-zinc-700"} size={20} />
                <h2 className={`font-black text-[11px] uppercase tracking-[0.3em] ${sections.account ? "text-white" : "text-zinc-500"}`}>
                  Security & Broadcast
                </h2>
              </div>
              {sections.account ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            {sections.account && (
              <div className="p-8 pt-0 space-y-4 animate-in fade-in duration-300">
                {[
                  { id: 'twoFactor', label: 'Enable Two-Factor Auth', icon: ShieldCheck },
                  { id: 'notifications', label: 'System Notifications (Email)', icon: Bell }
                ].map((item) => (
                  <label key={item.id} className="flex items-center justify-between p-4 bg-[#111111] border border-zinc-800 rounded cursor-pointer hover:border-zinc-600 transition-all">
                    <div className="flex items-center gap-3">
                      <item.icon size={16} className="text-zinc-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">{item.label}</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={accountSettings[item.id]} 
                      onChange={() => handleAccountToggle(item.id)}
                      className="w-4 h-4 accent-blue-600 bg-black border-zinc-800"
                    />
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Preferences Section */}
          <div className={sectionContainer}>
            <div className="p-6 flex justify-between items-center cursor-pointer hover:bg-zinc-900/50" onClick={() => toggleSection("preferences")}>
              <div className="flex items-center gap-4">
                <Globe className={sections.preferences ? "text-blue-500" : "text-zinc-700"} size={20} />
                <h2 className={`font-black text-[11px] uppercase tracking-[0.3em] ${sections.preferences ? "text-white" : "text-zinc-500"}`}>
                  Interface
                </h2>
              </div>
              {sections.preferences ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            {sections.preferences && (
              <div className="p-8 pt-0 space-y-6 animate-in fade-in duration-300">
                <label className="flex items-center justify-between p-4 bg-[#111111] border border-zinc-800 rounded cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Moon size={16} className="text-zinc-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">Sub-Zero Mode (Dark UI)</span>
                  </div>
                  <input type="checkbox" checked={preferences.darkMode} onChange={() => handlePreferenceToggle("darkMode")} className="w-4 h-4 accent-blue-600" />
                </label>
                <div>
                  <label className={labelText}>Regional Language</label>
                  <select 
                    value={preferences.language} 
                    onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                    className="w-full bg-[#111111] border border-zinc-800 p-4 rounded text-[10px] font-black uppercase tracking-widest text-blue-500 outline-none appearance-none"
                  >
                    <option>English</option>
                    <option>French</option>
                    <option>Spanish</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Danger Zone Section */}
          <div className="border border-red-900/30 bg-red-950/5 rounded overflow-hidden mt-12">
            <div className="p-6 flex justify-between items-center cursor-pointer hover:bg-red-950/10 transition-colors" onClick={() => toggleSection("danger")}>
              <div className="flex items-center gap-4">
                <AlertTriangle className="text-red-600" size={20} />
                <h2 className="font-black text-[11px] uppercase tracking-[0.3em] text-red-600">
                  Critical Decommission
                </h2>
              </div>
              {sections.danger ? <ChevronUp size={16} className="text-red-600"/> : <ChevronDown size={16} className="text-red-600"/>}
            </div>
            {sections.danger && (
              <div className="p-8 pt-0 animate-in slide-in-from-top-2 duration-300">
                <div className="p-6 border border-red-900/50 bg-red-900/10 rounded">
                  <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-6 leading-relaxed">
                    Warning: Account deletion will purge all queue history, business data, and active designations from the cluster.
                  </p>
                  <button
                    onClick={handleDeleteAccount}
                    className="flex items-center gap-2 bg-red-600 text-white px-8 py-3 rounded font-black text-[10px] uppercase tracking-[0.2em] hover:bg-red-700 transition-all active:scale-95"
                  >
                    <Trash2 size={14} />
                    Wipe All Data
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Save Button */}
        <button
          onClick={handleSave}
          className="md:hidden w-full mt-8 flex items-center justify-center gap-2 bg-blue-600 text-white py-5 rounded font-black text-[10px] uppercase tracking-[0.2em]"
        >
          <Save size={16} />
          Save Changes
        </button>

        {/* Floating Toast Notification */}
        {toastVisible && (
          <div className="fixed bottom-8 right-8 bg-blue-600 text-white px-6 py-4 rounded shadow-2xl border border-blue-400/30 animate-in slide-in-from-right duration-500 flex items-center gap-3">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest">System Synchronized</span>
          </div>
        )}
      </div>
    </div>
  );
}