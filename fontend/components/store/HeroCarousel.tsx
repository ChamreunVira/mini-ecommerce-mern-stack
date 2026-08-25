"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles, ShoppingBag, Tag } from "lucide-react";

interface Slide {
  id: number;
  tag: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  bgGradient: string;
  accentIcon: any;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    tag: "NEW COLLECTION 2026",
    title: "ស្វែងរក Style",
    titleHighlight: "ដែលសាកសមបំផុត",
    subtitle: "ស្វែងរក Collection ថ្មីៗ និងផលិតផលដែលបានជ្រើសរើសយ៉ាងពិសេសសម្រាប់អ្នក",
    ctaText: "ចាប់ផ្ដើមទិញឥឡូវនេះ",
    ctaLink: "/products",
    secondaryCtaText: "មើល Collection",
    secondaryCtaLink: "/products?filter=newest",
    bgGradient: "from-gray-950 via-gray-900 to-stone-900",
    accentIcon: Sparkles,
  },
  {
    id: 2,
    tag: "LIMITED TIME SALE",
    title: "បញ្ចុះតម្លៃពិសេស",
    titleHighlight: "រហូតដល់ 30%",
    subtitle: "ប្រញាប់ឡើង! ផលិតផលពេញនិយមជាច្រើនកំពុងស្ថិតក្នុងការបញ្ចុះតម្លៃចុងរដូវកាល",
    ctaText: "ទិញឥឡូវនេះ",
    ctaLink: "/products?filter=sale",
    secondaryCtaText: "ផលិតផលបញ្ចុះតម្លៃ",
    secondaryCtaLink: "/products?filter=sale",
    bgGradient: "from-stone-950 via-zinc-900 to-amber-950",
    accentIcon: Tag,
  },
  {
    id: 3,
    tag: "EDITORIAL STYLES",
    title: "ម៉ូដសំលៀកបំពាក់",
    titleHighlight: "បែបទំនើប និងប្រណិត",
    subtitle: "ផ្ដល់នូវភាពលេចធ្លោ និងទំនុកចិត្តខ្ពស់ក្នុងការស្លៀកពាក់ប្រចាំថ្ងៃ",
    ctaText: "ស្វែងរកម៉ូដថ្មី",
    ctaLink: "/products?category=Women",
    secondaryCtaText: "មើលម៉ូដពេញនិយម",
    secondaryCtaLink: "/products?filter=top",
    bgGradient: "from-slate-950 via-gray-900 to-indigo-950",
    accentIcon: ShoppingBag,
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // Auto slide effect
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  };

  // Touch / Drag handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      handleNext(); // Swipe left -> Next slide
    } else if (diff < -50) {
      handlePrev(); // Swipe right -> Prev slide
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  return (
    <section
      className="relative h-[85vh] min-h-[580px] overflow-hidden bg-gray-950 select-none group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides track */}
      {SLIDES.map((slide, index) => {
        const Icon = slide.accentIcon;
        const isActive = index === current;

        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            {/* Background gradient & SVG overlay pattern */}
            <div className={`absolute inset-0 bg-gradient-to-br ${slide.bgGradient}`} />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMwLTkuOTQtOC4wNi0xOC0xOC0xOCIgc3Ryb2tlPSIjZmZmZmZmMDgiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9nPjwvc3ZnPg==')] opacity-25" />
            <div className="absolute inset-0 bg-black/40" />

            {/* Slide content container */}
            <div className="relative h-full max-w-5xl mx-auto flex flex-col items-center justify-center text-center px-6 pt-10">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-black tracking-[0.25em] uppercase rounded-full mb-6">
                <Icon size={14} className="text-amber-400" /> {slide.tag}
              </span>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.25] tracking-tight max-w-4xl">
                {slide.title} <br className="hidden sm:inline" />
                <span className="text-amber-300 font-extrabold">{slide.titleHighlight}</span>
              </h1>

              <p className="mt-6 text-base sm:text-xl text-gray-300 max-w-2xl leading-[1.8] font-normal">
                {slide.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-9 w-full sm:w-auto">
                <Link
                  href={slide.ctaLink}
                  className="px-9 py-4 bg-white text-[#0a0a0a] text-sm font-extrabold hover:bg-gray-100 transition-all shadow-lg text-center tracking-wide"
                >
                  {slide.ctaText}
                </Link>
                <Link
                  href={slide.secondaryCtaLink}
                  className="px-9 py-4 border-2 border-white/50 text-white text-sm font-bold hover:border-white hover:bg-white/10 transition-all text-center tracking-wide"
                >
                  {slide.secondaryCtaText}
                </Link>
              </div>
            </div>
          </div>
        );
      })}

      {/* Prev / Next Navigation Arrow Buttons */}
      <button
        type="button"
        onClick={handlePrev}
        className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-black/40 text-white border border-white/20 flex items-center justify-center backdrop-blur-md opacity-80 group-hover:opacity-100 hover:bg-white hover:text-[#0a0a0a] transition-all"
        aria-label="Previous Slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        type="button"
        onClick={handleNext}
        className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-black/40 text-white border border-white/20 flex items-center justify-center backdrop-blur-md opacity-80 group-hover:opacity-100 hover:bg-white hover:text-[#0a0a0a] transition-all"
        aria-label="Next Slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-8 left-0 right-0 z-20 flex items-center justify-center gap-2.5">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrent(idx)}
            className={`h-2.5 transition-all duration-300 rounded-full ${
              idx === current
                ? "w-8 bg-amber-400"
                : "w-2.5 bg-white/40 hover:bg-white/70"
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
