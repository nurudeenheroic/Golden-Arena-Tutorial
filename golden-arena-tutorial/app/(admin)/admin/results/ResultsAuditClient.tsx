"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, Search, ExternalLink, Award } from "lucide-react";

interface AttemptRecord {
  id: string;
  score: number;
  totalQuestions: number;
  completedAt: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  quizId?: string;
  quizTitle: string;
  subjectName: string;
}

export default function ResultsAuditClient({
  attempts,
}: {
  attempts: AttemptRecord[];
}) {
  const [search, setSearch] = useState("");

  const filteredAttempts = attempts.filter((att) => {
    const query = search.toLowerCase();
    return (
      att.candidateName.toLowerCase().includes(query) ||
      att.candidateEmail.toLowerCase().includes(query) ||
      att.quizTitle.toLowerCase().includes(query) ||
      att.subjectName.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900">Exam Results Audit</h1>
          <p className="text-xs text-slate-500">
            Track individual student scores, pass rates, and completion timelines.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="size-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search candidate name or quiz..."
            className="w-full rounded-xl border border-stone-200 bg-white pl-8 pr-3 py-1.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#833b0c]"
          />
        </div>
      </div>

      {/* Audit Table */}
      <div className="rounded-3xl border border-stone-200 bg-white overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-stone-100 bg-stone-50/50 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="px-6 py-4">Candidate</th>
                <th className="px-6 py-4">Quiz / Exam Title</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Score</th>
                <th className="px-6 py-4">Percentage</th>
                <th className="px-6 py-4 text-right">Completion Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium text-slate-700">
              {filteredAttempts.length > 0 ? (
                filteredAttempts.map((att) => {
                  const total = att.totalQuestions || 1;
                  const pct = Math.round((att.score / total) * 100);
                  const isPassed = pct >= 50;

                  return (
                    <tr key={att.id} className="hover:bg-stone-50/50 transition">
                      {/* Candidate Name -> Links to /admin/users/[userId] */}
                      <td className="px-6 py-4">
                        {att.candidateId ? (
                          <Link
                            href={`/admin/users/${att.candidateId}`}
                            className="group/cand inline-flex items-center gap-1 font-bold text-slate-900 hover:text-[#833b0c] transition"
                          >
                            <div>
                              <span className="block font-black group-hover/cand:underline">
                                {att.candidateName}
                              </span>
                              <span className="text-[11px] text-slate-400 font-mono font-normal">
                                {att.candidateEmail}
                              </span>
                            </div>
                            <ExternalLink className="size-3 text-slate-300 group-hover/cand:text-[#833b0c] transition ml-1" />
                          </Link>
                        ) : (
                          <div>
                            <p className="font-bold text-slate-900">{att.candidateName}</p>
                            <p className="text-[11px] text-slate-400">{att.candidateEmail}</p>
                          </div>
                        )}
                      </td>

                      {/* Quiz Title -> Links to /admin/quizzes/[quizId] */}
                      <td className="px-6 py-4">
                        {att.quizId ? (
                          <Link
                            href={`/admin/quizzes/${att.quizId}`}
                            className="group/quiz inline-flex items-center gap-1 font-bold text-slate-800 hover:text-[#833b0c] transition"
                          >
                            <span className="group-hover/quiz:underline">{att.quizTitle}</span>
                            <ExternalLink className="size-3 text-slate-300 group-hover/quiz:text-[#833b0c] transition" />
                          </Link>
                        ) : (
                          <span className="font-bold text-slate-800">{att.quizTitle}</span>
                        )}
                      </td>

                      {/* Subject Badge */}
                      <td className="px-6 py-4">
                        <span className="rounded-lg bg-stone-100 px-2.5 py-1 text-[10px] font-bold text-slate-700 uppercase">
                          {att.subjectName}
                        </span>
                      </td>

                      {/* Score */}
                      <td className="px-6 py-4 font-black text-slate-900">
                        {att.score} / {att.totalQuestions}
                      </td>

                      {/* Percentage Badge */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold border ${
                            isPassed
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : "bg-red-50 text-red-800 border-red-200"
                          }`}
                        >
                          {isPassed ? (
                            <CheckCircle2 className="size-3 text-emerald-600" />
                          ) : (
                            <XCircle className="size-3 text-red-600" />
                          )}
                          {pct}%
                        </span>
                      </td>

                      {/* Completion Date */}
                      <td className="px-6 py-4 text-right text-[11px] text-slate-400 font-medium">
                        {att.completedAt
                          ? new Date(att.completedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "In Progress"}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-slate-400 font-medium">
                    No candidate exam submissions found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}