"use client";

import { useState, useEffect } from "react";
import { submitQuizAction } from "@/submit-quiz";
import { useRouter } from "next/navigation";
import { Clock, Flag, CheckCircle2, ChevronLeft, ChevronRight, Loader2, AlertCircle } from "lucide-react";

type Question = {
  id: string;
  text: string;
  options: string[];
};

type QuizRunnerClientProps = {
  quizId: string;
  quizTitle: string;
  timeLimitMinutes: number;
  questions: Question[];
};

export default function QuizRunnerClient({
  quizId,
  quizTitle,
  timeLimitMinutes,
  questions,
}: QuizRunnerClientProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(timeLimitMinutes * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      executeSubmission();
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const currentQuestion = questions[currentIndex];

  const handleOptionSelect = (optionText: string) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionText }));
  };

  const toggleFlag = () => {
    if (!currentQuestion) return;
    setFlagged((prev) => ({ ...prev, [currentQuestion.id]: !prev[currentQuestion.id] }));
  };

  // Triggers confirmation modal open
  const handleOpenSubmitModal = () => {
    setShowConfirmModal(true);
  };

  // Perform actual API submission
  const executeSubmission = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const timeSpentSec = Math.max(timeLimitMinutes * 60 - timeLeft, 1);

    const formattedResponses = Object.entries(answers).map(([questionId, selectedOption]) => ({
      questionId,
      selectedOption,
    }));

    try {
      const result = await submitQuizAction(quizId, formattedResponses, timeSpentSec);
      router.push(`/dashboard/quizzes/results/${result.attemptId}`);
    } catch (error: any) {
      console.error("Quiz submission error:", error);
      alert(error?.message || "There was an error submitting your quiz. Please try again.");
      setIsSubmitting(false);
      setShowConfirmModal(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const answeredCount = Object.keys(answers).length;
  const flaggedCount = Object.values(flagged).filter(Boolean).length;

  if (questions.length === 0) {
    return (
      <div className="mx-auto max-w-md p-12 text-center space-y-3">
        <p className="text-sm font-bold text-slate-800">No questions found in this quiz.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1000px] px-5 py-8 space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-2xs">
        <div>
          <h1 className="text-base font-black text-slate-900">{quizTitle}</h1>
          <p className="text-xs text-slate-500">
            Question {currentIndex + 1} of {questions.length}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-3.5 py-2 border border-amber-200 text-amber-900 font-mono text-sm font-bold">
            <Clock className="size-4 text-amber-700" />
            <span>{formatTime(timeLeft)}</span>
          </div>

          <button
            type="button"
            onClick={handleOpenSubmitModal}
            disabled={isSubmitting}
            className="rounded-xl bg-[#833b0c] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#6f300a] transition disabled:opacity-50 cursor-pointer"
          >
            Finish & Submit
          </button>
        </div>
      </div>

      {/* Main Question Display */}
      <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase text-slate-400">
            Question #{currentIndex + 1}
          </span>
          <button
            type="button"
            onClick={toggleFlag}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
              flagged[currentQuestion.id]
                ? "bg-amber-100 text-amber-900 border border-amber-300"
                : "bg-stone-100 text-slate-600 hover:bg-stone-200"
            }`}
          >
            <Flag className="size-3.5" />
            <span>{flagged[currentQuestion.id] ? "Flagged for Review" : "Flag"}</span>
          </button>
        </div>

        <p className="text-base font-bold text-slate-900 leading-relaxed">
          {currentQuestion.text}
        </p>

        <div className="grid gap-3 pt-2">
          {currentQuestion.options.map((opt, i) => {
            const isSelected = answers[currentQuestion.id] === opt;
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleOptionSelect(opt)}
                className={`flex items-center justify-between rounded-2xl border p-4 text-xs font-semibold transition cursor-pointer text-left ${
                  isSelected
                    ? "border-[#833b0c] bg-[#f9eee7] text-[#833b0c] ring-1 ring-[#833b0c]"
                    : "border-stone-200 bg-white text-slate-700 hover:bg-stone-50"
                }`}
              >
                <span>{opt}</span>
                {isSelected && <CheckCircle2 className="size-4 text-[#833b0c] shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-100">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((prev) => prev - 1)}
            className="inline-flex items-center gap-1 rounded-xl border border-stone-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-stone-50 disabled:opacity-40 cursor-pointer"
          >
            <ChevronLeft className="size-4" />
            <span>Previous</span>
          </button>

          <button
            type="button"
            disabled={currentIndex === questions.length - 1}
            onClick={() => setCurrentIndex((prev) => prev + 1)}
            className="inline-flex items-center gap-1 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
          >
            <span>Next</span>
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {/* Question Selector Palette Grid */}
      <div className="rounded-2xl border border-stone-200 bg-white p-5 space-y-3">
        <span className="text-xs font-bold text-slate-700">Question Palette</span>
        <div className="flex flex-wrap gap-2">
          {questions.map((q, idx) => {
            const isAnswered = Boolean(answers[q.id]);
            const isFlagged = Boolean(flagged[q.id]);
            const isCurrent = idx === currentIndex;

            let badgeStyle = "border-stone-200 bg-stone-50 text-slate-600";
            if (isCurrent) badgeStyle = "ring-2 ring-[#833b0c] border-[#833b0c] font-black";
            if (isAnswered) badgeStyle += " bg-[#833b0c] text-white border-[#833b0c]";
            if (isFlagged) badgeStyle += " border-amber-500 bg-amber-100 text-amber-900";

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`grid size-9 place-items-center rounded-xl border text-xs font-bold transition cursor-pointer ${badgeStyle}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-5 border border-stone-100">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-2xl bg-amber-100 text-amber-900">
                <AlertCircle className="size-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Submit Quiz?</h3>
                <p className="text-xs text-slate-500">Please review your progress before submitting.</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 rounded-2xl bg-stone-50 p-4 border border-stone-200 text-center">
              <div>
                <span className="block text-xs font-semibold text-slate-500">Attempted</span>
                <span className="text-sm font-black text-slate-900">{answeredCount} / {questions.length}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-slate-500">Flagged</span>
                <span className="text-sm font-black text-amber-700">{flaggedCount}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-slate-500">Time Left</span>
                <span className="text-sm font-black text-slate-900">{formatTime(timeLeft)}</span>
              </div>
            </div>

            {answeredCount < questions.length && (
              <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 p-3 rounded-xl">
                ⚠️ You have <strong>{questions.length - answeredCount}</strong> unanswered question(s). Unanswered questions will be scored as incorrect.
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                disabled={isSubmitting}
                className="rounded-xl border border-stone-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-stone-50 transition cursor-pointer"
              >
                Continue Test
              </button>
              <button
                type="button"
                onClick={executeSubmission}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-xl bg-[#833b0c] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#6f300a] transition disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Confirm & Submit</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}