"use client";

import { useState } from "react";
import { Settings, Save, CheckCircle2, Shield } from "lucide-react";

export default function AdminSettingsPage() {
  const [platformName, setPlatformName] = useState("General Aptitude Test (GAT)");
  const [supportEmail, setSupportEmail] = useState("support@gatprep.com");
  const [defaultQuizTime, setDefaultQuizTime] = useState(45);
  const [allowGuestPreview, setAllowGuestPreview] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-black text-slate-900">System Configurations</h1>
        <p className="text-xs text-slate-500">Manage global platform parameters and candidate test defaults.</p>
      </div>

      <form onSubmit={handleSave} className="rounded-3xl border border-stone-200 bg-white p-6 shadow-2xs space-y-5">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Platform Portal Title</label>
          <input
            type="text"
            value={platformName}
            onChange={(e) => setPlatformName(e.target.value)}
            className="w-full rounded-xl border border-stone-200 p-3 text-xs font-medium outline-none focus:border-[#833b0c]"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Support Email</label>
            <input
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              className="w-full rounded-xl border border-stone-200 p-3 text-xs font-medium outline-none focus:border-[#833b0c]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Default Quiz Duration (Mins)</label>
            <input
              type="number"
              value={defaultQuizTime}
              onChange={(e) => setDefaultQuizTime(Number(e.target.value))}
              className="w-full rounded-xl border border-stone-200 p-3 text-xs font-medium outline-none focus:border-[#833b0c]"
            />
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <label className="flex items-center justify-between rounded-2xl bg-stone-50 border border-stone-200 p-4 cursor-pointer">
            <div>
              <span className="block text-xs font-bold text-slate-900">Allow Guest Demo Practice</span>
              <span className="text-[10px] text-slate-500">Unregistered users can try sample questions without signing in.</span>
            </div>
            <input
              type="checkbox"
              checked={allowGuestPreview}
              onChange={(e) => setAllowGuestPreview(e.target.checked)}
              className="size-4 accent-[#833b0c]"
            />
          </label>

          <label className="flex items-center justify-between rounded-2xl bg-red-50/50 border border-red-200 p-4 cursor-pointer">
            <div>
              <span className="block text-xs font-bold text-red-950">Maintenance Mode</span>
              <span className="text-[10px] text-red-700">Temporarily block candidate login and test taking during updates.</span>
            </div>
            <input
              type="checkbox"
              checked={maintenanceMode}
              onChange={(e) => setMaintenanceMode(e.target.checked)}
              className="size-4 accent-red-600"
            />
          </label>
        </div>

        {saved && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3.5 text-xs font-bold text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
            <span>Settings saved successfully!</span>
          </div>
        )}

        <button
          type="submit"
          className="w-full rounded-xl bg-[#833b0c] py-3 text-xs font-bold text-white shadow-xs hover:bg-[#6f300a] transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Save className="size-4" />
          <span>Save System Settings</span>
        </button>
      </form>
    </div>
  );
}