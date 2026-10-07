"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Search,
  Trash2,
  Loader2,
  Image as ImageIcon,
  BookOpen,
  Filter,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Mnemonic {
  id: string;
  title: string;
  image_url?: string | null;
  topic_name?: string | null;
  subject_id?: string;
  subjects?: { id: string; name: string } | null;
}

export default function MnemonicsManagerClient({
  initialMnemonics,
}: {
  initialMnemonics: Mnemonic[];
}) {
  const [mnemonics, setMnemonics] = useState<Mnemonic[]>(initialMnemonics);
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Extract unique subjects and topics for filters
  const uniqueSubjects = Array.from(
    new Set(
      mnemonics
        .map((m) => m.subjects?.name)
        .filter((name): name is string => Boolean(name))
    )
  );

  const uniqueTopics = Array.from(
    new Set(
      mnemonics
        .map((m) => m.topic_name)
        .filter((topic): topic is string => Boolean(topic && topic.trim() !== ""))
    )
  );

  // Filter mnemonics by search keyword, subject, and topic
  const filteredMnemonics = mnemonics.filter((m) => {
    const subjectName = m.subjects?.name ?? "";
    const matchesSearch =
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      subjectName.toLowerCase().includes(search.toLowerCase()) ||
      (m.topic_name && m.topic_name.toLowerCase().includes(search.toLowerCase()));

    const matchesSubject =
      !selectedSubject || selectedSubject === ""
        ? true
        : subjectName.toLowerCase() === selectedSubject.toLowerCase();

    const matchesTopic =
      !selectedTopic || selectedTopic === ""
        ? true
        : m.topic_name?.toLowerCase().trim() === selectedTopic.toLowerCase().trim();

    return matchesSearch && matchesSubject && matchesTopic;
  });

  // Delete Handler
  const handleDelete = async (id: string, imageUrl?: string | null) => {
    if (!confirm("Are you sure you want to delete this mnemonic chart? This action cannot be undone.")) {
      return;
    }

    setDeletingId(id);
    const supabase = createClient();

    // 1. Delete from database
    const { error } = await supabase.from("study_notes").delete().eq("id", id);

    if (error) {
      alert(`Failed to delete mnemonic: ${error.message}`);
    } else {
      setMnemonics((prev) => prev.filter((item) => item.id !== id));
      
      // Optional: Delete from storage bucket if stored in Supabase
      if (imageUrl && imageUrl.includes("question-images")) {
        const pathParts = imageUrl.split("/question-images/");
        if (pathParts[1]) {
          await supabase.storage.from("question-images").remove([pathParts[1]]);
        }
      }
    }

    setDeletingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/notes"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#833b0c] transition mb-2"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Hub</span>
          </Link>
          <h1 className="text-xl font-black text-slate-900">Visual Mnemonics ({filteredMnemonics.length})</h1>
          <p className="text-xs text-slate-500">
            Search, filter, review, or remove sectioned infographics and memory charts.
          </p>
        </div>

        <Link
          href="/admin/notes/mnemonics/new"
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#833b0c] px-4 py-2.5 text-xs font-bold text-white shadow-2xs hover:bg-[#6f300a] transition cursor-pointer"
        >
          <Plus className="size-4" />
          <span>Upload Mnemonic</span>
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <div className="rounded-2xl border border-stone-200 bg-white p-4 space-y-3 shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-black text-slate-700 uppercase tracking-wider">
          <Filter className="size-3.5 text-[#833b0c]" />
          <span>Search & Filters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Keyword Search */}
          <div className="relative">
            <Search className="size-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, subject, or topic..."
              className="w-full rounded-xl border border-stone-200 bg-stone-50 pl-8 pr-3 py-2 text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-[#833b0c]"
            />
          </div>

          {/* Subject Filter */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="rounded-xl border border-stone-200 bg-stone-50 p-2 text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-[#833b0c]"
          >
            <option value="">All Subjects</option>
            {uniqueSubjects.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>

          {/* Topic / Section Filter */}
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="rounded-xl border border-stone-200 bg-stone-50 p-2 text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-[#833b0c]"
          >
            <option value="">All Topics / Sections</option>
            {uniqueTopics.map((top) => (
              <option key={top} value={top}>
                {top}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mnemonics Grid */}
      {filteredMnemonics.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMnemonics.map((m) => {
            const subjectName = m.subjects?.name ?? "General";

            return (
              <div
                key={m.id}
                className="rounded-2xl border border-stone-200 bg-white p-5 space-y-4 flex flex-col justify-between shadow-2xs hover:border-[#833b0c]/40 transition"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded-lg bg-amber-50 px-2.5 py-1 text-[10px] font-extrabold text-amber-900 border border-amber-200 uppercase">
                      {subjectName}
                    </span>
                    {m.topic_name && (
                      <span className="text-[10px] font-bold text-slate-500 truncate max-w-[160px]">
                        Section: {m.topic_name}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug">{m.title}</h3>

                  {/* Image Asset Preview */}
                  {m.image_url ? (
                    <div className="rounded-xl border border-stone-200 bg-stone-50 p-2 overflow-hidden flex items-center gap-3">
                      <div className="size-16 rounded-lg bg-white border border-stone-200 shrink-0 overflow-hidden flex items-center justify-center p-0.5">
                        <img src={m.image_url} alt={m.title} className="h-full w-full object-contain rounded-md" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold text-slate-700 flex items-center gap-1 truncate">
                          <ImageIcon className="size-3 text-[#833b0c] shrink-0" />
                          <span>Infographic Chart</span>
                        </p>
                        <a
                          href={m.image_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-bold text-[#833b0c] hover:underline truncate block mt-0.5"
                        >
                          View Full Image ↗
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-stone-200 p-4 text-center text-xs text-slate-400">
                      No image attached
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-medium">
                    Added {new Date(m.created_at || Date.now()).toLocaleDateString()}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleDelete(m.id, m.image_url)}
                    disabled={deletingId === m.id}
                    className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-[11px] font-bold text-rose-700 hover:bg-rose-100 transition disabled:opacity-50 cursor-pointer"
                  >
                    {deletingId === m.id ? (
                      <Loader2 className="size-3 animate-spin" />
                    ) : (
                      <Trash2 className="size-3 text-rose-600" />
                    )}
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-stone-200 bg-white p-12 text-center space-y-3">
          <BookOpen className="mx-auto size-8 text-slate-300" />
          <p className="text-xs font-bold text-slate-700">No mnemonics found matching your search or filters.</p>
          <Link
            href="/admin/notes/mnemonics/new"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#833b0c] px-4 py-2 text-xs font-bold text-white hover:bg-[#6f300a] transition"
          >
            <Plus className="size-3.5" />
            <span>Upload New Mnemonic</span>
          </Link>
        </div>
      )}
    </div>
  );
}