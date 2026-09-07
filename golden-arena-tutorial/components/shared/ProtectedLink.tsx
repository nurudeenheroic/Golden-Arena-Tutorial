"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

interface ProtectedLinkProps {
  href: string;
  children: React.ReactNode;
  user?: { name: string; isPaid?: boolean } | null;
  requiresPaid?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function ProtectedLink({
  href,
  children,
  user,
  requiresPaid = false,
  className = "",
  onClick,
}: ProtectedLinkProps) {
  const [modalType, setModalType] = useState<"signup" | "upgrade" | null>(null);
  const [mounted, setMounted] = useState(false);

  // Ensure DOM portal target is available on client
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    // 1. Visitor trying to access protected link
    if (!user) {
      e.preventDefault();
      setModalType("signup");
      return;
    }

    // 2. Free candidate trying to access paid link
    if (requiresPaid && !user.isPaid) {
      e.preventDefault();
      setModalType("upgrade");
      return;
    }

    if (onClick) onClick();
  };

  const modalContent = (
    <>
      {/* SIGN UP MODAL FOR VISITORS */}
      {modalType === "signup" && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="size-12 bg-[#f9eee7] text-[#833b0c] rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              🎓
            </div>

            <h3 className="text-base font-bold text-slate-900">
              Account Required
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed">
              Create a free candidate account on GAT to access study materials and mock exams.
            </p>

            <div className="flex flex-col gap-2 pt-2">
              <Link
                href={`/signup?callbackUrl=${encodeURIComponent(href)}`}
                onClick={() => setModalType(null)}
                className="w-full rounded-xl bg-[#833b0c] py-2.5 text-xs font-bold text-white transition hover:bg-[#6f300a]"
              >
                Create Account
              </Link>

              <button
                type="button"
                onClick={() => setModalType(null)}
                className="text-xs font-medium text-slate-400 hover:text-slate-600 py-1"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPGRADE MODAL FOR FREE CANDIDATES */}
      {modalType === "upgrade" && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <span className="inline-block rounded-full bg-[#f9eee7] px-3 py-1 text-[10px] font-bold text-[#833b0c]">
              PRO ACCESS
            </span>

            <h3 className="text-base font-bold text-slate-900">
              Subscription Needed
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed">
              This resource requires an active subscription. Contact us on WhatsApp to upgrade your account.
            </p>

            <div className="flex flex-col gap-2 pt-2">
              <a
                href={`https://wa.me/2348123456789?text=${encodeURIComponent(
                  `Hi Admin, I want to unlock access to: ${href}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setModalType(null)}
                className="w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700"
              >
                Upgrade on WhatsApp →
              </a>

              <button
                type="button"
                onClick={() => setModalType(null)}
                className="text-xs font-medium text-slate-400 hover:text-slate-600 py-1"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      <Link href={href} onClick={handleClick} className={className}>
        {children}
      </Link>

      {/* Portals the modal outside of the header DOM tree straight into document.body */}
      {mounted && modalType && createPortal(modalContent, document.body)}
    </>
  );
}
