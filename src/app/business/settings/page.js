"use client";

import React, { use, useState } from "react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  // All fields dynamic, no fixed values
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

  const sectionClass = "border rounded p-4 mb-4 shadow-sm hover:shadow-md transition-shadow";

  return (
    <div className="p-8 max-w-4xl mx-auto relative">
      <button
        onClick={() => router.push("/business/dashboard")}
        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Settings</h1>

      {/* Business Info */}
      <section className={sectionClass}>
        <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSection("business")}>
          <h2 className="text-xl font-semibold text-blue-600">Business Info</h2>
          <span>{sections.business ? "▲" : "▼"}</span>
        </div>
        {sections.business && (
          <div className="mt-4 space-y-2">
            <input
              name="name"
              value={businessInfo.name}
              onChange={handleBusinessChange}
              placeholder="Business Name"
              className="border p-2 w-full rounded"
            />
            <input
              name="email"
              value={businessInfo.email}
              onChange={handleBusinessChange}
              placeholder="Business Email"
              className="border p-2 w-full rounded"
            />
            <input
              name="phone"
              value={businessInfo.phone}
              onChange={handleBusinessChange}
              placeholder="Phone Number"
              className="border p-2 w-full rounded"
            />
            <input
              name="address"
              value={businessInfo.address}
              onChange={handleBusinessChange}
              placeholder="Business Address"
              className="border p-2 w-full rounded"
            />
            <div>
              <label className="block mb-1">Business Logo:</label>
              <input type="file" accept="image/*" onChange={handleLogoUpload} />
              {businessInfo.logo && (
                <Image
                  src={businessInfo.logo}
                  alt="Logo Preview"
                  className="mt-2 w-32 h-32 object-contain border p-1 rounded"
                />
              )}
            </div>
          </div>
        )}
      </section>

      {/* Account Settings */}
      <section className={sectionClass}>
        <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSection("account")}>
          <h2 className="text-xl font-semibold">Account Settings</h2>
          <span>{sections.account ? "▲" : "▼"}</span>
        </div>
        {sections.account && (
          <div className="mt-4 space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={accountSettings.twoFactor}
                onChange={() => handleAccountToggle("twoFactor")}
                className="accent-blue-600"
              />
              Two-Factor Authentication
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={accountSettings.notifications}
                onChange={() => handleAccountToggle("notifications")}
                className="accent-blue-600"
              />
              Email Notifications
            </label>
          </div>
        )}
      </section>

      {/* Preferences */}
      <section className={sectionClass}>
        <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSection("preferences")}>
          <h2 className="text-xl font-semibold">Preferences</h2>
          <span>{sections.preferences ? "▲" : "▼"}</span>
        </div>
        {sections.preferences && (
          <div className="mt-4 space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={preferences.darkMode}
                onChange={() => handlePreferenceToggle("darkMode")}
                className="accent-blue-600"
              />
              Dark Mode
            </label>
            <label>
              Language:
              <select
                value={preferences.language}
                onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                className="border p-1 ml-2 rounded bg-blue-600"
              >
                <option>English</option>
                <option>French</option>
                <option>Spanish</option>
              </select>
            </label>
          </div>
        )}
      </section>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 mb-6"
      >
        Save Changes
      </button>

      {/* Danger Zone */}
      <section className={sectionClass}>
        <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSection("danger")}>
          <h2 className="text-xl font-semibold text-red-600">Danger Zone</h2>
          <span>{sections.danger ? "▲" : "▼"}</span>
        </div>
        {sections.danger && (
          <div className="mt-4">
            <button
              onClick={handleDeleteAccount}
              className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
            >
              Delete Account
            </button>
          </div>
        )}
      </section>

      {/* Floating Toast */}
      {toastVisible && (
        <div className="fixed bottom-8 right-8 bg-green-600 text-white px-4 py-2 rounded shadow-lg">
          Action completed successfully!
        </div>
      )}
    </div>
  );
}