"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Lock,
  Play,
  Calendar,
  Clock,
  HelpCircle,
  Sparkles,
  Search,
  BookOpen,
  X,
} from "lucide-react";

export type FormattedQuiz = {
  id: string;
  title: string;
  subject: string;
  category?: string; // 'utme' or 'post-utme'
  durationMinutes: number;
  isFreeTier: boolean;
  isUpcoming: boolean;
  scheduledFor?: string | null;
  attempted: boolean;
  lastScorePercentage?: number;
};

type QuizzesClientHubProps = {
  quizzes: FormattedQuiz[];
  isPaid: boolean;
};

export default function QuizzesClientHub({
  quizzes,
  isPaid,
}: QuizzesClientHubProps) {
  const router = useRouter();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"utme" | "post-utme">("utme"); // 👈 Category separator tab state
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const handleQuizClick = (quiz: FormattedQuiz) => {
    if (quiz.isUpcoming) return;
    if (!quiz.isFreeTier && !isPaid) {
      setShowUpgradeModal(true);
      return;
    }
    router.push(`/dashboard/quizzes/${quiz.id}`);
  };

  // Filter quizzes by active category tab first
  const tabQuizzes = quizzes.filter((q) => {
    const cat = q.category ?? "utme";
    return activeTab === "post-utme" ? cat === "post-utme" : cat !== "post-utme";
  });

  const availableSubjects = [
    "All",
    ...Array.from(new Set(tabQuizzes.map((q) => q.subject))).filter(Boolean),
  ];

  const filteredQuizzes = tabQuizzes.filter((q) => {
    const matchesSubject =
      selectedSubject === "All" || q.subject === selectedSubject;
    const matchesSearch = q.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  const availableQuizzes = filteredQuizzes.filter((q) => !q.isUpcoming);
  const upcomingQuizzes = filteredQuizzes.filter((q) => q.isUpcoming);

  return (
    <div className="mx-auto max-w-[1280px] px-5 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-2xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            CBT Quiz & Practice Center
          </h1>
          <p className="text-xs text-slate-500">
            Select between UTME Practice Drills and Post-UTME Screening Tests.
          </p>
        </div>

        <div>
          {!isPaid ? (
            <button
              type="button"
              onClick={() => setShowUpgradeModal(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-amber-600 transition cursor-pointer"
            >
              <Sparkles className="size-4" />
              <span>Upgrade to Pro All-Access</span>
            </button>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
              <Sparkles className="size-3.5 fill-emerald-600" /> Pro Candidate Active
            </span>
          )}
        </div>
      </div>

      {/* Category Tabs Switcher (UTME vs Post-UTME) */}
      <div className="flex border-b border-stone-200 gap-8">
        <button
          type="button"
          onClick={() => { setActiveTab("utme"); setSelectedSubject("All"); }}
          className={`pb-3 text-xs font-black tracking-wide transition border-b-2 cursor-pointer ${
            activeTab === "utme"
              ? "border-[#833b0c] text-[#833b0c]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          UTME Practice Tests
        </button>
        <button
          type="button"
          onClick={() => { setActiveTab("post-utme"); setSelectedSubject("All"); }}
          className={`pb-3 text-xs font-black tracking-wide transition border-b-2 cursor-pointer ${
            activeTab === "post-utme"
              ? "border-[#833b0c] text-[#833b0c]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Post-UTME Screen Tests
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {availableSubjects.map((sub) => (
            <button
              key={sub}
              type="button"
              onClick={() => setSelectedSubject(sub)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition shrink-0 cursor-pointer ${
                selectedSubject === sub
                  ? "bg-[#833b0c] text-white shadow-2xs"
                  : "bg-white border border-stone-200 text-slate-600 hover:bg-stone-50"
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search quizzes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-white pl-10 pr-4 py-2 text-xs font-medium outline-none focus:border-[#833b0c]"
          />
        </div>
      </div>

      {/* Available Quizzes Grid */}
      <section className="space-y-4">
        {availableQuizzes.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableQuizzes.map((quiz) => (
              <div
                key={quiz.id}
                onClick={() => handleQuizClick(quiz)}
                className="group relative flex flex-col justify-between rounded-2xl border border-stone-200 bg-white p-5 shadow-2xs hover:border-[#833b0c]/40 hover:shadow-md transition cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-lg bg-stone-100 px-2.5 py-1 text-[10px] font-bold text-slate-700">
                      {quiz.subject}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {quiz.attempted ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="size-3 text-emerald-600" />
                          Attempted {quiz.lastScorePercentage !== undefined && `(${quiz.lastScorePercentage}%)`}
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                          Not Yet Attempted
                        </span>
                      )}

                      {!quiz.isFreeTier && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-extrabold text-amber-900 border border-amber-200">
                          <Lock className="size-3 text-amber-700" /> Paid
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#833b0c] transition leading-snug">
                    {quiz.title}
                  </h3>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Clock className="size-3.5 text-slate-400" />
                    {quiz.durationMinutes} mins
                  </span>
                  <div className="flex items-center gap-1 font-bold text-[#833b0c] group-hover:translate-x-1 transition">
                    <span>Start</span>
                    <Play className="size-3 fill-[#833b0c]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-stone-200 bg-white p-12 text-center space-y-2">
            <HelpCircle className="mx-auto size-8 text-slate-300" />
            <p className="text-sm font-bold text-slate-800">No quizzes found for this category</p>
          </div>
        )}
      </section>

      {/* UPGRADE MODAL */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-5">
            <button
              type="button"
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-4 right-4 grid size-8 place-items-center rounded-full bg-stone-100 text-slate-500 hover:bg-stone-200 cursor-pointer"
            >
              <X className="size-4" />
            </button>
            <div className="space-y-2">
              <h3 className="text-lg font-black text-slate-900">Unlock Full Access</h3>
              <p className="text-xs text-slate-600">This drill contains premium questions reserved for Pro Candidates.</p>
            </div>
            <Link
              href="/dashboard#pricing"
              onClick={() => setShowUpgradeModal(false)}
              className="block w-full rounded-xl bg-[#833b0c] py-3 text-center text-xs font-bold text-white shadow-md hover:bg-[#6f300a] transition"
            >
              Upgrade Plan Now
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}