"use client";

import { useState } from "react";
import { Edit3, Check, X, Loader2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type ProfileNameEditorProps = {
  userId: string;
  googleFullName: string;
  initialDisplayName: string;
};

export function ProfileNameEditor({
  userId,
  googleFullName,
  initialDisplayName,
}: ProfileNameEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [savedDisplayName, setSavedDisplayName] = useState(initialDisplayName);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSave = async () => {
    setError(null);
    setSuccessMsg(null);
    const cleanName = displayName.trim();

    if (!cleanName || cleanName.length < 3) {
      setError("Display name must be at least 3 characters.");
      return;
    }

    setIsSaving(true);
    const supabase = createClient();

    // Check duplicate against display_name column
    const { data: existingUser } = await supabase
      .from("profiles")
      .select("id")
      .eq("display_name", cleanName)
      .neq("id", userId)
      .maybeSingle();

    if (existingUser) {
      setError("This display name is already taken by another candidate.");
      setIsSaving(false);
      return;
    }

    // Update BOTH display_name and name to maintain consistency
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        display_name: cleanName,
        name: cleanName,
      })
      .eq("id", userId);

    setIsSaving(false);

    if (updateError) {
      setError("Failed to update display name. Please try again.");
    } else {
      setSavedDisplayName(cleanName);
      setIsEditing(false);
      setSuccessMsg("Display name updated! Reloading portal...");

      // Hard refresh to re-evaluate Next.js layout state
      setTimeout(() => {
        window.location.reload();
      }, 400);
    }
  };

  const handleCancel = () => {
    setDisplayName(savedDisplayName);
    setIsEditing(false);
    setError(null);
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700 border border-red-200">
          <AlertCircle className="size-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-700 border border-emerald-200">
          <Check className="size-4 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-500">
            Full Name (From Google Account)
          </label>
          <input
            type="text"
            readOnly
            value={googleFullName}
            className="w-full rounded-xl border border-stone-200 bg-stone-100/70 px-3.5 py-2.5 text-xs font-medium text-slate-600 outline-none cursor-not-allowed"
          />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-semibold text-slate-500">
              Unique Platform Display Name
            </label>
            {!isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#833b0c] hover:underline"
              >
                <Edit3 className="size-3" />
                <span>Edit</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly={!isEditing}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter unique display name"
              className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-bold outline-none transition ${
                isEditing
                  ? "border-[#833b0c] bg-white text-slate-900 ring-2 ring-[#833b0c]/10"
                  : "border-stone-200 bg-stone-50 text-slate-800"
              }`}
            />

            {isEditing && (
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="inline-flex items-center gap-1 rounded-xl bg-[#833b0c] px-3.5 py-2.5 text-xs font-bold text-white shadow-2xs hover:bg-[#6f300a] transition disabled:opacity-50"
                >
                  {isSaving ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <>
                      <Check className="size-3.5" />
                      <span>Save</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="grid size-9 place-items-center rounded-xl border border-stone-200 bg-white text-slate-600 hover:bg-stone-50 transition"
                  title="Cancel"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}