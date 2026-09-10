import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { BookOpen, Plus, Lock, Calendar, Edit3, ArrowLeft } from "lucide-react";

export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{ subjectId?: string }>;
}

export default async function AdminQuizzesPage({ searchParams }: PageProps) {
  const { subjectId } = await searchParams;
  const supabase = await createClient();

  // Build query and filter by subject_id if parameter is present
  let query = supabase.from("quizzes").select(`
      id,
      title,
      time_limit,
      price,
      is_free_tier,
      is_upcoming,
      scheduled_for,
      subject_id,
      subjects ( name )
    `);

  if (subjectId) {
    query = query.eq("subject_id", subjectId);
  }

  const { data: quizzes } = await query.order("id", { ascending: false });

  // If filtered, fetch subject name for header display
  let filteredSubjectName = "";
  if (subjectId && quizzes && quizzes.length > 0) {
    filteredSubjectName =
      (quizzes[0].subjects as unknown as { name?: string })?.name ?? "";
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {subjectId && (
            <Link
              href="/admin/subjects"
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-[#833b0c] transition mb-1"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to Subjects</span>
            </Link>
          )}
          <h1 className="text-xl font-black text-slate-900">
            {filteredSubjectName
              ? `${filteredSubjectName} Quizzes & Drills`
              : "Quiz & Exam Management"}
          </h1>
          <p className="text-xs text-slate-500">
            Configure practice drills, Pro pricing, and live mock exam schedules.
          </p>
        </div>

        <Link
          href="/admin/quizzes/new"
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#833b0c] px-4 py-2.5 text-xs font-bold text-white shadow-2xs hover:bg-[#6f300a] transition cursor-pointer"
        >
          <Plus className="size-4" />
          <span>Create New Quiz</span>
        </Link>
      </div>

      {/* Quizzes Responsive Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quizzes && quizzes.length > 0 ? (
          quizzes.map((quiz) => {
            const subjectName =
              (quiz.subjects as unknown as { name?: string })?.name ??
              "General";

            return (
              <div
                key={quiz.id}
                className="group rounded-2xl border border-stone-200 bg-white p-5 space-y-4 flex flex-col justify-between hover:border-[#833b0c]/40 transition shadow-2xs"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="rounded-lg bg-stone-100 px-2.5 py-1 text-[10px] font-bold text-slate-700">
                      {subjectName}
                    </span>

                    <div className="flex items-center gap-1">
                      {quiz.is_free_tier ? (
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                          Free Tier
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-900 border border-amber-200">
                          <Lock className="size-3 text-amber-700" />
                          Pro Only
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Clicking the quiz title navigates directly to /admin/quizzes/[quizId] */}
                  <Link
                    href={`/admin/quizzes/${quiz.id}`}
                    className="block group-hover:text-[#833b0c] transition"
                  >
                    <h3 className="text-sm font-black text-slate-900 leading-snug">
                      {quiz.title}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                    <span>Duration: {quiz.time_limit} Mins</span>
                    {quiz.is_upcoming && (
                      <span className="inline-flex items-center gap-1 text-amber-800 font-bold">
                        <Calendar className="size-3" /> Scheduled
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <Link
                    href={`/admin/quizzes/${quiz.id}`}
                    className="inline-flex items-center gap-1.5 font-bold text-[#833b0c] hover:underline"
                  >
                    <Edit3 className="size-3.5" />
                    <span>Manage Quiz & Questions</span>
                  </Link>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full rounded-2xl border border-stone-200 bg-white p-12 text-center space-y-2">
            <BookOpen className="mx-auto size-8 text-slate-300" />
            <p className="text-xs font-bold text-slate-700">
              No quizzes created yet.
            </p>
            <p className="text-[11px] text-slate-400">
              Click &quot;Create New Quiz&quot; above to set up your first exam drill.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}