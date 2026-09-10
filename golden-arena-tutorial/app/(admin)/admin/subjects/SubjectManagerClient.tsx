"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookMarked,
  Plus,
  Loader2,
  ExternalLink,
  Atom,
  Palette,
  Briefcase,
  Globe2,
  ArrowRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Subject = {
  id: string;
  name: string;
  track: string;
};

const TRACK_METADATA = [
  {
    key: "science",
    label: "Science Track",
    icon: Atom,
    color: "bg-blue-50 text-blue-800 border-blue-200",
    badge: "bg-blue-100 text-blue-900",
  },
  {
    key: "arts",
    label: "Arts & Humanities",
    icon: Palette,
    color: "bg-purple-50 text-purple-800 border-purple-200",
    badge: "bg-purple-100 text-purple-900",
  },
  {
    key: "commercial",
    label: "Commercial Track",
    icon: Briefcase,
    color: "bg-emerald-50 text-emerald-800 border-emerald-200",
    badge: "bg-emerald-100 text-emerald-900",
  },
  {
    key: "general",
    label: "General & Compulsory",
    icon: Globe2,
    color: "bg-amber-50 text-amber-800 border-amber-200",
    badge: "bg-amber-100 text-amber-900",
  },
];

export default function SubjectManagerClient({
  initialSubjects,
}: {
  initialSubjects: Subject[];
}) {
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [name, setName] = useState("");
  const [track, setTrack] = useState("science");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    const supabase = createClient();

    const { data, error } = await supabase
      .from("subjects")
      .insert({ name: name.trim(), track })
      .select()
      .single();

    if (!error && data) {
      setSubjects((prev) => [...prev, data]);
      setName("");
    } else {
      alert(error?.message || "Failed to create subject.");
    }
    setIsSubmitting(false);
  };

  const filteredSubjects =
    activeTab === "all"
      ? subjects
      : subjects.filter((s) => s.track?.toLowerCase() === activeTab.toLowerCase());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-black text-slate-900">
          Academic Tracks & Subjects
        </h1>
        <p className="text-xs text-slate-500">
          Configure UTME subject categories, tracks, and practice items.
        </p>
      </div>

      {/* Track Overview Cards Grid (4 Tracks) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {TRACK_METADATA.map((t) => {
          const count = subjects.filter(
            (s) => s.track?.toLowerCase() === t.key
          ).length;
          const Icon = t.icon;

          return (
            <Link
              key={t.key}
              href={`/admin/subjects/track/${t.key}`}
              className={`group rounded-2xl border p-5 space-y-3 transition shadow-2xs hover:shadow-md cursor-pointer ${t.color}`}
            >
              <div className="flex items-center justify-between">
                <span className={`rounded-lg px-2.5 py-1 text-[10px] font-black uppercase ${t.badge}`}>
                  {count} Subjects
                </span>
                <Icon className="size-5 group-hover:scale-110 transition-transform" />
              </div>

              <div>
                <h3 className="text-sm font-black text-slate-900">{t.label}</h3>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                  Click to open {t.label} preview page
                </p>
              </div>

              <div className="pt-1 flex items-center gap-1 text-xs font-bold text-[#833b0c] group-hover:underline">
                <span>View Track Page</span>
                <ArrowRight className="size-3.5" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Track Selector Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
            activeTab === "all"
              ? "bg-slate-900 text-white"
              : "bg-white text-slate-600 border border-stone-200 hover:bg-stone-100"
          }`}
        >
          All Tracks ({subjects.length})
        </button>

        {TRACK_METADATA.map((t) => {
          const count = subjects.filter(
            (s) => s.track?.toLowerCase() === t.key
          ).length;

          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setActiveTab(t.key)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                activeTab === t.key
                  ? "bg-[#833b0c] text-white"
                  : "bg-white text-slate-600 border border-stone-200 hover:bg-stone-100"
              }`}
            >
              {t.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Main Content Grid: Add Form + Filtered Cards */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Add New Subject Card Form */}
        <form
          onSubmit={handleCreate}
          className="rounded-3xl border border-stone-200 bg-white p-6 shadow-2xs space-y-4 h-fit"
        >
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Plus className="size-4 text-[#833b0c]" />
            <span>Add New Subject</span>
          </h2>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              Subject Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Further Mathematics"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-stone-200 p-3 text-xs font-medium outline-none focus:border-[#833b0c]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              Academic Track
            </label>
            <select
              value={track}
              onChange={(e) => setTrack(e.target.value)}
              className="w-full rounded-xl border border-stone-200 p-3 text-xs font-medium outline-none focus:border-[#833b0c]"
            >
              <option value="science">Science</option>
              <option value="arts">Arts / Humanities</option>
              <option value="commercial">Commercial</option>
              <option value="general">General / Compulsory</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-[#833b0c] py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#6f300a] transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Save Subject"
            )}
          </button>
        </form>

        {/* Subjects Grid */}
        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-3">
          {filteredSubjects.length === 0 ? (
            <div className="sm:col-span-2 p-8 text-center text-xs font-bold text-slate-400 bg-white rounded-3xl border border-stone-200">
              No subjects registered under this track filter yet.
            </div>
          ) : (
            filteredSubjects.map((sub) => (
              <Link
                key={sub.id}
                href={`/admin/subjects/${sub.id}`}
                className="group rounded-2xl border border-stone-200 bg-white p-5 space-y-3 flex flex-col justify-between hover:border-[#833b0c]/50 transition cursor-pointer shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-lg bg-[#f9eee7] px-2.5 py-1 text-[10px] font-bold text-[#833b0c] uppercase">
                    {sub.track}
                  </span>
                  <BookMarked className="size-4 text-slate-400 group-hover:text-[#833b0c] transition" />
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-base font-black text-slate-900 group-hover:text-[#833b0c] transition">
                    {sub.name}
                  </p>
                  <ExternalLink className="size-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition" />
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}