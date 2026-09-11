"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Upload, CheckCircle2, AlertCircle, FileText, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function CSVUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const parseCSV = (text: string): string[][] => {
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentVal = "";
    let insideQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];

      if (char === '"') {
        if (insideQuotes && nextChar === '"') {
          currentVal += '"';
          i++;
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (char === "," && !insideQuotes) {
        currentRow.push(currentVal.trim().replace(/^["']|["']$/g, ""));
        currentVal = "";
      } else if ((char === "\n" || char === "\r") && !insideQuotes) {
        if (char === "\r" && nextChar === "\n") i++;
        currentRow.push(currentVal.trim().replace(/^["']|["']$/g, ""));
        if (currentRow.some((cell) => cell.length > 0)) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentVal = "";
      } else {
        currentVal += char;
      }
    }
    if (currentVal || currentRow.length > 0) {
      currentRow.push(currentVal.trim().replace(/^["']|["']$/g, ""));
      if (currentRow.some((cell) => cell.length > 0)) {
        rows.push(currentRow);
      }
    }
    return rows;
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setStatusMsg(null);
    try {
      const text = await file.text();
      const rows = parseCSV(text);
      
      if (rows.length < 2) {
        throw new Error("CSV file must contain a header row and at least one question row.");
      }

      const headers = rows[0];
      const dataRows = rows.slice(1);

      const record: Record<string, any> = {};
        headers.forEach((header, idx) => {
          // Clean BOM, whitespace, and normalize to lowercase for fail-safe matching
          const cleanHeader = header.replace(/^\ufeff/, "").trim().toLowerCase();
          const rawValue = row[idx] ?? "";
          
          record[cleanHeader] = rawValue;
          record[header.trim()] = rawValue;
        });
        return record;
      });

      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const allowedCategories = ["UTME", "POST_UTME", "WAEC", "NECO", "GENERAL", "JUPEB", "PUTME"];
      const allowedDifficulties = ["easy", "medium", "hard"];

      const supabase = createClient();
      const formattedQuestions = records.map((r) => {
        let parsedOptions: string[] = [];
        try {
          parsedOptions = JSON.parse(r.options || "[]");
        } catch {
          parsedOptions = r.options ? r.options.split(";").map((s: string) => s.trim()) : [];
        }

        const rawAns = (r.correct_answer || "A").trim();
        let actualAnswer = rawAns;
        if (rawAns.length === 1 && /^[a-zA-Z]$/.test(rawAns)) {
          const optIndex = rawAns.toUpperCase().charCodeAt(0) - 65;
          if (optIndex >= 0 && optIndex < parsedOptions.length) {
            actualAnswer = parsedOptions[optIndex];
          }
        }

        const validSubjectId = uuidRegex.test(r.subject_id)
          ? r.subject_id
          : "155e6c15-5625-4f1d-8096-c907d6664b6f";

        const rawDiff = (r.difficulty || "medium").toLowerCase().trim();
        const difficulty = allowedDifficulties.includes(rawDiff) ? rawDiff : "medium";

        const rawCategory = (r.exam_category || "UTME").toUpperCase().trim();
        const exam_category = allowedCategories.includes(rawCategory) ? rawCategory : "UTME";

        // Check various header capitalizations for topic
        const rawTopic = r.topic || r.Topic || r.TOPIC || r["Study Topic"] || r["Subject Topic"] || "";
        const topic = typeof rawTopic === "string" && rawTopic.trim() !== "" ? rawTopic.trim() : null;

        return {
          question_code: r.question_code || null,
          text: r.text,
          options: parsedOptions,
          correct_answer: actualAnswer,
          explanation: r.explanation || null,
          difficulty: difficulty,
          exam_category: exam_category,
          subject_id: validSubjectId,
          year: parseInt(r.year || "2026", 10),
          topic: topic,
        };
      });

      const { error } = await supabase
        .from("questions")
        .upsert(formattedQuestions, { onConflict: "question_code" });

      if (error) {
        console.error("Batch upsert error:", error);
        throw new Error(error.message);
      }

      setStatusMsg({
        type: "success",
        text: `Successfully uploaded and synced ${formattedQuestions.length} questions into the bank!`,
      });
      setFile(null);
    } catch (err: any) {
      console.error("Upload process error:", err);
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
      <Link href="/admin/questions" className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-[#833b0c]">
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
            Expected CSV headers: <code>question_code, text, options, correct_answer, explanation, difficulty, exam_category, subject_id, year</code>
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