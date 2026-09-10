"use client";

import { useState, Fragment } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Users,
  ExternalLink,
  Search,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface AttemptRecord {
  attemptId: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  score: number;
  totalQuestions: number;
  timeTakenSec: number;
  createdAt: string;
}

interface DrillItem {
  quizId: string;
  quizTitle: string;
  totalAttempts: number;
  uniqueCandidates: number;
  avgScorePct: number;
  attemptsList: AttemptRecord[];
}

export default function DrillsListClient({ drills }: { drills: DrillItem[] }) {
  const [expandedQuizId, setExpandedQuizId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleExpand = (quizId: string) => {
    setExpandedQuizId((prev) => (prev === quizId ? null : quizId));
  };

  const filteredDrills = drills.filter((d) =>
    d.quizTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDuration = (sec: number) => {
    if (!sec) return "N/A";
    const mins = Math.floor(sec / 60);
    const remainingSec = sec % 60;
    return `${mins}m ${remainingSec}s`;
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/analytics"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#833b0c] transition mb-2"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Main Analytics</span>
          </Link>
          <h1 className="text-2xl font-black text-slate-900">
            Drills Performance Breakdown
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Detailed performance stats for each quiz drill and candidate attempt log.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="size-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search drill title..."
            className="w-full rounded-xl border border-stone-200 bg-white pl-8 pr-3 py-1.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#833b0c]"
          />
        </div>
      </div>

      {/* Drills Table */}
      <div className="rounded-3xl border border-stone-200 bg-white shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/50 text-[10px] font-black uppercase tracking-wider text-slate-400">
                <th className="p-4 pl-6">Drill / Assessment Title</th>
                <th className="p-4">Unique Candidates</th>
                <th className="p-4">Total Attempts</th>
                <th className="p-4">Average Score</th>
                <th className="p-4 pr-6 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium text-slate-700">
              {filteredDrills.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-8 text-center text-slate-400 font-semibold"
                  >
                    No drills or assessments found matching your query.
                  </td>
                </tr>
              ) : (
                filteredDrills.map((drill) => {
                  const isExpanded = expandedQuizId === drill.quizId;

                  return (
                    <Fragment key={drill.quizId}>
                      {/* Main Summary Row - Properly mapped to <td> elements */}
                      <tr className="hover:bg-stone-50/60 transition">
                        {/* 1. Drill Title */}
                        <td className="p-4 pl-6">
                          <Link
                            href={`/admin/quizzes/${drill.quizId}`}
                            className="group/link inline-flex items-center gap-1.5 font-black text-slate-900 hover:text-[#833b0c] transition"
                          >
                            <BookOpen className="size-4 text-[#833b0c] shrink-0" />
                            <span className="group-hover/link:underline">
                              {drill.quizTitle}
                            </span>
                            <ExternalLink className="size-3 text-slate-400 group-hover/link:text-[#833b0c] transition" />
                          </Link>
                        </td>

                        {/* 2. Unique Candidates */}
                        <td className="p-4 font-bold text-slate-700">
                          <div className="flex items-center gap-1.5">
                            <Users className="size-3.5 text-slate-400" />
                            <span>{drill.uniqueCandidates} students</span>
                          </div>
                        </td>

                        {/* 3. Total Attempts */}
                        <td className="p-4 font-bold text-slate-700">
                          {drill.totalAttempts} sessions
                        </td>

                        {/* 4. Average Score Badge */}
                        <td className="p-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                              drill.avgScorePct >= 60
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : drill.avgScorePct >= 40
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-rose-50 text-rose-700 border border-rose-200"
                            }`}
                          >
                            {drill.avgScorePct}% avg
                          </span>
                        </td>

                        {/* 5. Toggle Dropdown Button */}
                        <td className="p-4 pr-6 text-right">
                          <button
                            type="button"
                            onClick={() => toggleExpand(drill.quizId)}
                            className="inline-flex items-center gap-1 rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-stone-100 transition cursor-pointer"
                          >
                            <span>{isExpanded ? "Hide" : "View"}</span>
                            {isExpanded ? (
                              <ChevronUp className="size-3.5 text-[#833b0c]" />
                            ) : (
                              <ChevronDown className="size-3.5 text-[#833b0c]" />
                            )}
                          </button>
                        </td>
                      </tr>

                      {/* Dropdown Details Row */}
                      {isExpanded && (
                        <tr className="bg-stone-50/80">
                          <td colSpan={5} className="p-6 border-b border-stone-200/80">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between pb-1">
                                <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider">
                                  Candidate Attempt Logs ({drill.attemptsList.length})
                                </h3>
                                <Link
                                  href={`/admin/quizzes/${drill.quizId}`}
                                  className="text-xs font-bold text-[#833b0c] hover:underline"
                                >
                                  Edit Drill Questions →
                                </Link>
                              </div>

                              <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-2xs">
                                <table className="w-full text-left text-xs">
                                  <thead>
                                    <tr className="border-b border-stone-100 bg-stone-50/50 text-[10px] font-black uppercase text-slate-400">
                                      <th className="p-3 pl-4">Candidate</th>
                                      <th className="p-3">Score & Accuracy</th>
                                      <th className="p-3">Time Spent</th>
                                      <th className="p-3 pr-4 text-right">
                                        Date Completed
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-stone-100 font-medium">
                                    {drill.attemptsList.map((att) => {
                                      const accuracy = Math.round(
                                        (att.score / att.totalQuestions) * 100
                                      );
                                      const isPassed = accuracy >= 50;

                                      return (
                                        <tr
                                          key={att.attemptId}
                                          className="hover:bg-stone-50/80 transition"
                                        >
                                          {/* Candidate Name Link */}
                                          <td className="p-3 pl-4">
                                            <Link
                                              href={`/admin/users/${att.candidateId}`}
                                              className="group/cand inline-flex items-center gap-1.5 font-bold text-slate-900 hover:text-[#833b0c] transition"
                                            >
                                              <div>
                                                <span className="block font-black group-hover/cand:underline">
                                                  {att.candidateName}
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-mono">
                                                  {att.candidateEmail}
                                                </span>
                                              </div>
                                            </Link>
                                          </td>

                                          {/* Score / Accuracy */}
                                          <td className="p-3">
                                            <div className="flex items-center gap-2">
                                              {isPassed ? (
                                                <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                                              ) : (
                                                <XCircle className="size-3.5 text-rose-500 shrink-0" />
                                              )}
                                              <div>
                                                <span className="font-black text-slate-900">
                                                  {att.score} / {att.totalQuestions}
                                                </span>
                                                <span
                                                  className={`ml-1.5 text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                                                    isPassed
                                                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                      : "bg-rose-50 text-rose-700 border border-rose-200"
                                                  }`}
                                                >
                                                  {accuracy}%
                                                </span>
                                              </div>
                                            </div>
                                          </td>

                                          {/* Duration */}
                                          <td className="p-3 text-slate-600">
                                            {formatDuration(att.timeTakenSec)}
                                          </td>

                                          {/* Date */}
                                          <td className="p-3 pr-4 text-right text-slate-400">
                                            {new Date(
                                              att.createdAt
                                            ).toLocaleDateString("en-US", {
                                              month: "short",
                                              day: "numeric",
                                              year: "numeric",
                                              hour: "2-digit",
                                              minute: "2-digit",
                                            })}
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}