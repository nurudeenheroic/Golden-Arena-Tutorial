"use client";

import { useState, useEffect, useRef } from "react";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { testimonials } from "./data";

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Determine total slides based on item count
  const totalItems = testimonials.length;

  // Function to move to next slide
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalItems);
  };

  // Function to move to previous slide
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
  };

  // Auto-play timer (slides every 3.5 seconds when not hovered)
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 3500);

    return () => clearInterval(interval);
  }, [isHovered, currentIndex]);

  return (
    <section className="mx-auto max-w-[1440px] px-5 pb-16 lg:px-8 space-y-6">
      {/* Header section with carousel control arrows */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <SectionHeading
          title="What Our Students Say"
          description="Real stories. Real results."
        />

        {/* Carousel Navigation Arrow Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto pb-2">
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous testimonials"
            className="grid size-9 place-items-center rounded-xl border border-stone-200 bg-white text-slate-700 shadow-sm transition hover:border-[#833b0c] hover:bg-[#f9eee7] hover:text-[#833b0c] active:scale-95"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next testimonials"
            className="grid size-9 place-items-center rounded-xl border border-stone-200 bg-white text-slate-700 shadow-sm transition hover:border-[#833b0c] hover:bg-[#f9eee7] hover:text-[#833b0c] active:scale-95"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {/* Slide Container (Pauses on hover) */}
      <div
        ref={containerRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="overflow-hidden py-2"
      >
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / getResponsiveCardWidth())}%)`,
          }}
        >
          {testimonials.map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className="w-full shrink-0 px-2 sm:w-1/2 lg:w-1/3"
            >
              <article className="flex h-full flex-col justify-between rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-[#833b0c]/40 hover:shadow-md">
                <div className="flex items-start gap-4">
                  {/* Initial Avatar */}
                  <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#f9eee7] text-sm font-black text-[#833b0c]">
                    {item.name.charAt(0)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <Quote className="size-5 text-[#833b0c]/30" />
                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600 line-clamp-4">
                      “{item.quote}”
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-end justify-between border-t border-stone-100 pt-4">
                  <div>
                    <p className="text-xs font-bold text-slate-900">{item.name}</p>
                    <p className="mt-0.5 text-[10px] font-medium text-slate-500">{item.role}</p>
                  </div>

                  <div className="flex gap-0.5" aria-label="5 star rating">
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <Star
                        key={`${index}-${starIndex}`}
                        className="size-3.5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Helper to calculate responsive width percentages for translation math
function getResponsiveCardWidth() {
  if (typeof window !== "undefined") {
    if (window.innerWidth >= 1024) return 3; // 3 visible cards on Desktop
    if (window.innerWidth >= 640) return 2;  // 2 visible cards on Tablet
  }
  return 1; // 1 card on Mobile
}