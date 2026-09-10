"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Upload, CheckCircle2, AlertCircle, FileText, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function CSVUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setStatusMsg(null);

    try {
      const text = await file.text();
      const lines = text.split("\n").filter((l) => l.trim().length > 0);
      if (lines.length < 2) {
        throw new Error("CSV file must contain a header row and at least one question row.");
      }

      const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));

      // Parse CSV records
      const records = lines.slice(1).map((line) => {
        const values = line
          .split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/)
          .map((v) => v.trim().replace(/^"|"$/g, ""));
        const record: Record<string, any> = {};
        headers.forEach((header, idx) => {
          record[header] = values[idx] ?? "";
        });
        return record;
      });

      const supabase = createClient();

      const formattedQuestions = records.map((r) => {
        let parsedOptions: string[] = [];
        try {
          parsedOptions = JSON.parse(r.options || "[]");
        } catch {
          // Fallback if options are semicolon delimited (e.g. "Opt A; Opt B; Opt C; Opt D")
          parsedOptions = r.options ? r.options.split(";").map((s: string) => s.trim()) : [];
        }

        return {
          question_code: r.question_code || null,
          text: r.text,
          options: parsedOptions,
          correct_answer: r.correct_answer || "A",
          explanation: r.explanation || null,
          difficulty: r.difficulty || "medium",
          exam_category: r.exam_category || "utme",
          subject_id: r.subject_id,
          year: parseInt(r.year || "2026", 10),
        };
      });

      const { error } = await supabase.from("questions").insert(formattedQuestions);

      if (error) throw error;

      setStatusMsg({
        type: "success",
        text: `Successfully uploaded ${formattedQuestions.length} questions into the bank!`,
      });
      setFile(null);
    } catch (err: any) {
      setStatusMsg({
        type: "error",
        text: err.message || "Failed to parse and insert CSV questions.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href="/questions" className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-[#833b0c]">
        <ArrowLeft className="size-4" />
        <span>Back to Question Bank</span>
      </Link>

      <div>
        <h1 className="text-xl font-black text-slate-900">Bulk Upload Questions via CSV</h1>
        <p className="text-xs text-slate-500">
          Batch import questions, options, keys, and step-by-step solutions into Supabase.
        </p>
      </div>

      <div className="rounded-3xl border-2 border-dashed border-stone-200 bg-white p-8 text-center space-y-4">
        <div className="grid size-12 place-items-center rounded-2xl bg-[#f9eee7] text-[#833b0c] mx-auto">
          <Upload className="size-6" />
        </div>

        <div>
          <label className="cursor-pointer font-bold text-xs text-[#833b0c] hover:underline">
            <span>Click to select .csv file</span>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="hidden"
            />
          </label>
          <p className="text-[11px] text-slate-400 mt-1">
            Expected CSV headers: <code>subject_id, text, options, correct_answer, explanation, difficulty, year</code>
          </p>
        </div>

        {file && (
          <div className="inline-flex items-center gap-2 rounded-xl bg-stone-100 px-3 py-1.5 text-xs font-bold text-slate-700">
            <FileText className="size-4 text-[#833b0c]" />
            <span>{file.name}</span>
          </div>
        )}
      </div>

      {statusMsg && (
        <div
          className={`flex items-center gap-2 rounded-xl p-4 text-xs font-bold border ${
            statusMsg.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {statusMsg.type === "success" ? (
            <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="size-4 text-red-600 shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      <button
        type="button"
        disabled={!file || isUploading}
        onClick={handleUpload}
        className="w-full rounded-xl bg-[#833b0c] py-3 text-xs font-bold text-white shadow-xs hover:bg-[#6f300a] transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
      >
        {isUploading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            <span>Processing CSV...</span>
          </>
        ) : (
          <span>Start Upload Process</span>
        )}
      </button>
    </div>
  );
}