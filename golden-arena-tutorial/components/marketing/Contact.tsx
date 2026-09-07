"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";

export function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="scroll-mt-24 py-16 bg-stone-50/60 border-t border-stone-100">
      <div className="mx-auto max-w-[1440px] px-5 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#f9eee7] px-3.5 py-1 text-xs font-bold text-[#833b0c]">
            <Mail className="size-3.5 text-[#833b0c]" />
            <span>Get In Touch</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            We’re Here to Help
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Have an inquiry or need technical support? Send us a message and our team will get back to you promptly.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 max-w-5xl mx-auto items-start">
          
          {/* Contact Details Card */}
          <div className="lg:col-span-5 rounded-2xl bg-[#833b0c] p-6 text-white space-y-6 shadow-xl">
            <div>
              <h3 className="text-lg font-bold">Contact Information</h3>
              <p className="mt-1 text-xs text-white/75 leading-relaxed">
                Reach out to us directly through any of these support channels.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-white/10 text-white">
                  <Phone className="size-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/60">Phone / WhatsApp</p>
                  <p className="text-xs font-semibold mt-0.5">+234 816 076 4272</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-white/10 text-white">
                  <Mail className="size-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/60">Email Support</p>
                  <p className="text-xs font-semibold mt-0.5">support@gat.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-white/10 text-white">
                  <MapPin className="size-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/60">Location</p>
                  <p className="text-xs font-semibold mt-0.5">Lagos, Nigeria</p>
                </div>
              </div>
            </div>

            <div className="border-t border-white/15 pt-4 text-[11px] text-white/70">
              ⚡ Average response time: <span className="font-bold text-white">Under 2 hours</span>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            {submitted ? (
              <div className="text-center py-8 space-y-3">
                <div className="mx-auto grid size-12 place-items-center rounded-full bg-[#f9eee7] text-[#833b0c]">
                  <CheckCircle className="size-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Message Sent!</h3>
                <p className="text-xs text-slate-600 max-w-xs mx-auto">
                  Thank you for reaching out. A support representative will respond to your email shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 rounded-xl border border-stone-300 px-4 py-2 text-xs font-bold text-slate-800 transition hover:border-[#833b0c] hover:text-[#833b0c]"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Full Name</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Chinedu Okafor"
                      className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs text-slate-900 focus:border-[#833b0c] focus:outline-none focus:ring-1 focus:ring-[#833b0c]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Email Address</label>
                    <input
                      required
                      type="email"
                      placeholder="e.g. chinedu@gmail.com"
                      className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs text-slate-900 focus:border-[#833b0c] focus:outline-none focus:ring-1 focus:ring-[#833b0c]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Subject</label>
                  <input
                    required
                    type="text"
                    placeholder="How can we help you?"
                    className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs text-slate-900 focus:border-[#833b0c] focus:outline-none focus:ring-1 focus:ring-[#833b0c]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Message</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe your inquiry or technical question..."
                    className="w-full rounded-xl border border-stone-200 p-3 text-xs text-slate-900 focus:border-[#833b0c] focus:outline-none focus:ring-1 focus:ring-[#833b0c]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#833b0c] py-3 text-xs font-bold text-white shadow-md transition hover:bg-[#6f300a]"
                >
                  <Send className="size-3.5" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}