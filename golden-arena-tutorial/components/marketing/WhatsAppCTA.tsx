// Warm WhatsApp study-group banner.
// The actual URL lives in data.ts (WHATSAPP_GROUP_URL) — update it there,
// not here, so the Navbar link and this banner never fall out of sync.

import { ArrowRight, MessageCircle } from "lucide-react";
import { WHATSAPP_GROUP_URL } from "./data";

export function WhatsAppCTA() {
  return (
    <section className="mx-auto max-w-[1440px] px-5 pb-10 lg:px-8">
      <div className="relative overflow-hidden rounded-2xl bg-[#833b0c] px-6 py-7 text-white shadow-sm sm:px-8">
        {/* Decorative circles are CSS-only so no extra image is required. */}
        <div className="pointer-events-none absolute -right-12 -top-16 size-52 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute bottom-[-90px] left-1/2 size-64 rounded-full border border-white/10" />

        <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div className="max-w-xl">
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-full bg-white/15">
                <MessageCircle className="size-6" />
              </div>
              <h2 className="text-xl font-extrabold">Join Our WhatsApp Study Groups</h2>
            </div>

            <p className="mt-2 text-sm leading-6 text-white/75">
              Get updates, important materials, live classes, and connect with
              other students.
            </p>
          </div>

          <a
            href={WHATSAPP_GROUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-white px-5 py-3 text-xs font-bold text-[#833b0c] transition hover:bg-[#fff5ed]"
          >
            Join WhatsApp Group
            <ArrowRight className="size-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
