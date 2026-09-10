"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Trophy,
  Medal,
  Award,
  Search,
  ExternalLink,
  Flame,
  Info,
  X,
  CheckCircle2,
} from "lucide-react";

interface CandidateRank {
  userId: string;
  name: string;
  email: string;
  totalPoints: number;
  testsCompleted: number;
  accuracyPct: number;
}

export default function LeaderboardClient({
  rankings,
}: {
  rankings: CandidateRank[];
}) {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const filteredRankings = rankings.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase())
  );

  const topThree = rankings.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Trophy className="size-5 text-[#833b0c]" />
              <span>Master Candidate Leaderboard</span>
            </h1>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-1 text-[10px] font-bold text-slate-600 hover:bg-[#f9eee7] hover:text-[#833b0c] transition cursor-pointer"
            >
              <Info className="size-3 text-[#833b0c]" />
              <span>How Points Work</span>
            </button>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Candidates ranked by cumulative points earned from quiz percentages.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="size-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search candidate name or email..."
            className="w-full rounded-xl border border-stone-200 bg-white pl-8 pr-3 py-1.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#833b0c]"
          />
        </div>
      </div>

      {/* Top 3 Podium Grid */}
      {topThree.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Gold - 1st Place */}
          {topThree[0] && (
            <div className="rounded-3xl border-2 border-amber-300 bg-gradient-to-b from-amber-50/80 to-white p-5 space-y-3 relative shadow-xs">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-[10px] font-black text-amber-900 uppercase">
                  <Trophy className="size-3 text-amber-600" /> Rank #1 Gold
                </span>
                <Flame className="size-5 text-amber-600" />
              </div>
              <div>
                <Link
                  href={`/admin/users/${topThree[0].userId}`}
                  className="font-black text-base text-slate-900 hover:text-[#833b0c] transition block truncate"
                >
                  {topThree[0].name}
                </Link>
                <p className="text-[11px] text-slate-400 truncate">{topThree[0].email}</p>
              </div>
              <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700">{topThree[0].totalPoints} Pts Earned</span>
                <span className="text-amber-800">{topThree[0].accuracyPct}% Avg Accuracy</span>
              </div>
            </div>
          )}

          {/* Silver - 2nd Place */}
          {topThree[1] && (
            <div className="rounded-3xl border border-slate-300 bg-gradient-to-b from-slate-100/60 to-white p-5 space-y-3 relative shadow-xs">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-200 px-3 py-1 text-[10px] font-black text-slate-800 uppercase">
                  <Medal className="size-3 text-slate-600" /> Rank #2 Silver
                </span>
              </div>
              <div>
                <Link
                  href={`/admin/users/${topThree[1].userId}`}
                  className="font-black text-base text-slate-900 hover:text-[#833b0c] transition block truncate"
                >
                  {topThree[1].name}
                </Link>
                <p className="text-[11px] text-slate-400 truncate">{topThree[1].email}</p>
              </div>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700">{topThree[1].totalPoints} Pts Earned</span>
                <span className="text-slate-600">{topThree[1].accuracyPct}% Avg Accuracy</span>
              </div>
            </div>
          )}

          {/* Bronze - 3rd Place */}
          {topThree[2] && (
            <div className="rounded-3xl border border-orange-200 bg-gradient-to-b from-orange-50/50 to-white p-5 space-y-3 relative shadow-xs">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-[10px] font-black text-orange-900 uppercase">
                  <Award className="size-3 text-orange-600" /> Rank #3 Bronze
                </span>
              </div>
              <div>
                <Link
                  href={`/admin/users/${topThree[2].userId}`}
                  className="font-black text-base text-slate-900 hover:text-[#833b0c] transition block truncate"
                >
                  {topThree[2].name}
                </Link>
                <p className="text-[11px] text-slate-400 truncate">{topThree[2].email}</p>
              </div>
              <div className="pt-2 border-t border-orange-200/60 flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700">{topThree[2].totalPoints} Pts Earned</span>
                <span className="text-orange-800">{topThree[2].accuracyPct}% Avg Accuracy</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Rankings Table */}
      <div className="rounded-3xl border border-stone-200 bg-white overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-stone-100 bg-stone-50/50 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="px-6 py-4">Rank</th>
                <th className="px-6 py-4">Candidate</th>
                <th className="px-6 py-4">Drills Completed</th>
                <th className="px-6 py-4">Total Points</th>
                <th className="px-6 py-4 text-right">Avg Accuracy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium text-slate-700">
              {filteredRankings.length > 0 ? (
                filteredRankings.map((candidate, idx) => (
                  <tr key={candidate.userId} className="hover:bg-stone-50/50 transition">
                    <td className="px-6 py-4 font-black text-slate-900">
                      #{idx + 1}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/users/${candidate.userId}`}
                        className="group/cand inline-flex items-center gap-1 font-bold text-slate-900 hover:text-[#833b0c] transition"
                      >
                        <div>
                          <span className="block font-black group-hover/cand:underline">
                            {candidate.name}
                          </span>
                          <span className="text-[11px] text-slate-400 font-normal">
                            {candidate.email}
                          </span>
                        </div>
                        <ExternalLink className="size-3 text-slate-300 group-hover/cand:text-[#833b0c] transition ml-1" />
                      </Link>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800">
                      {candidate.testsCompleted} Quizzes
                    </td>
                    <td className="px-6 py-4 font-black text-[#833b0c]">
                      {candidate.totalPoints} Pts
                    </td>
                    <td className="px-6 py-4 text-right font-extrabold text-emerald-700">
                      {candidate.accuracyPct}%
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-xs text-slate-400">
                    No leaderboard rankings recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* HOW POINTS WORK MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="size-5 text-[#833b0c]" />
                <h3 className="text-sm font-black text-slate-900 uppercase">
                  Leaderboard Scoring Rules
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="grid size-7 place-items-center rounded-lg text-slate-400 hover:bg-stone-100 cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed font-medium">
              <div className="p-3 bg-[#f9eee7]/60 rounded-2xl border border-[#833b0c]/20 space-y-1">
                <p className="font-bold text-[#833b0c] flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-[#833b0c]" />
                  <span>Percentage-Based Point Calculation</span>
                </p>
                <p>
                  Points are awarded based on the candidate&apos;s percentage score in each completed quiz. Every 10% earned equals 1 Point.
                </p>
              </div>

              <ul className="space-y-2 text-[11px] list-disc list-inside text-slate-700">
                <li>
                  <strong>Example 1:</strong> Scoring <strong>70%</strong> on Quiz A grants <strong>7.0 Points</strong>.
                </li>
                <li>
                  <strong>Example 2:</strong> Scoring <strong>100%</strong> on Quiz B grants <strong>10.0 Points</strong>.
                </li>
                <li>
                  <strong>Total Points:</strong> The sum of points earned across all completed drills and exams.
                </li>
                <li>
                  <strong>Average Accuracy:</strong> The average percentage score across all completed quizzes.
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="w-full rounded-2xl bg-[#833b0c] py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#6f300a] transition cursor-pointer"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
}