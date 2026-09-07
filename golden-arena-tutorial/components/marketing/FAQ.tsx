"use client";

import { useState } from "react";
import { HelpCircle, ChevronDown, MessageSquare } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Are the questions up to date with the 2026 JAMB syllabus?",
    answer:
      "Yes, absolutely! All UTME and Post-UTME practice questions are regularly updated to align strictly with the latest official syllabus and examination pattern.",
  },
  {
    question: "How does the single Quiz and Mock Exam payment work?",
    answer:
      "You can unlock a single topic quiz for ₦300 or a complete 4-subject CBT Mock Exam for ₦500 without committing to a full subscription. Access is instant upon payment.",
  },
  {
    question: "What is included in the ₦10,000 All-Access Pass?",
    answer:
      "The All-Access Pass gives you complete, unlimited access to thousands of UTME & Post-UTME past questions, all full-length Mock Exams, timed quizzes, detailed step-by-step solutions, and priority WhatsApp study group entry for the entire session.",
  },
  {
    question: "Can I use GAT on my mobile phone?",
    answer:
      "Yes! GAT is fully optimized for all mobile smartphones, tablets, and desktop computers so you can practice anywhere, anytime.",
  },
  {
    question: "How do I join the WhatsApp study group?",
    answer:
      "Once you sign up or purchase an All-Access Pass, an invite link to your subject-specific study group will be displayed on your candidate dashboard.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="scroll-mt-24 py-16 bg-white">
      <div className="mx-auto max-w-[1440px] px-5 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#f9eee7] px-3.5 py-1 text-xs font-bold text-[#833b0c]">
            <HelpCircle className="size-3.5 text-[#833b0c]" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Everything you need to know about GAT practice tests, payments, and preparation.
          </p>
        </div>

        {/* Accordion Container */}
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className="group rounded-2xl border border-stone-200 bg-white transition-all duration-200 hover:border-[#833b0c]/40 hover:shadow-md"
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#833b0c] transition-colors"
                >
                  <span>{faq.question}</span>
                  <div
                    className={`grid size-7 shrink-0 place-items-center rounded-full bg-stone-100 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-[#f9eee7] text-[#833b0c]" : "text-slate-500"
                    }`}
                  >
                    <ChevronDown className="size-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-stone-100 pt-3 animate-in fade-in slide-in-from-top-1">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}