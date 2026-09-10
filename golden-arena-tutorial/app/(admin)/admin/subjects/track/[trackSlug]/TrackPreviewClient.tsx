"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookMarked,
  Plus,
  Loader2,
  ExternalLink,
  Atom,
  Palette,
  Briefcase,
  Globe2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Subject = {
  id: string;
  name: string;
  track: string;
};

const TRACK_MAP: Record<string, { label: string; icon: any }> = {
  science: { label: "Science Track", icon: Atom },
  arts: { label: "Arts & Humanities Track", icon: Palette },
  commercial: { label: "Commercial Track", icon: Briefcase },
  general: { label: "General & Compulsory Track", icon: Globe2 },
};

export default function TrackPreviewClient({
  trackSlug,
  initialSubjects,
}: {
  trackSlug: string;
  initialSubjects: Subject[];
}) {
  const normalizedTrack = trackSlug.toLowerCase();
  const trackInfo = TRACK_MAP[normalizedTrack] || {
    label: `${trackSlug.toUpperCase()} Track`,
    icon: BookMarked,
  };
  const TrackIcon = trackInfo.icon;

  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [name, setName] = useState("");
  const [track, setTrack] = useState(normalizedTrack);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/admin/subjects"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#833b0c] transition mb-2"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to All Academic Tracks</span>
        </Link>
        <div className="flex items-center gap-3">
          <TrackIcon className="size-6 text-[#833b0c]" />
          <h1 className="text-2xl font-black text-slate-900">
            {trackInfo.label} Preview
          </h1>
        </div>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Showing all {subjects.length} registered subjects under the {trackInfo.label}.
        </p>
      </div>

      {/* Layout Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Add New Subject Card Form */}
        <form
          onSubmit={handleCreate}
          className="rounded-3xl border border-stone-200 bg-white p-6 shadow-2xs space-y-4 h-fit"
        >
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Plus className="size-4 text-[#833b0c]" />
            <span>Add Subject to {trackInfo.label}</span>
          </h2>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Subject Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Organic Chemistry"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-stone-200 p-3 text-xs font-medium outline-none focus:border-[#833b0c]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Academic Track</label>
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
          {subjects.length === 0 ? (
            <div className="sm:col-span-2 p-8 text-center text-xs font-bold text-slate-400 bg-white rounded-3xl border border-stone-200">
              No subjects registered under this track yet. Use the form on the left to add one.
            </div>
          ) : (
            subjects.map((sub) => (
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