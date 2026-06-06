"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useCategories } from "../../hooks/useCategories";

// ─── Smart image resolver (case-insensitive) ───────────────────────────────
function getCategoryImage(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("academic"))                                          return "/Academic.png";
  if (n.includes("cambridge"))                                         return "/Cambridge.png";
  if (n.includes("sindh"))                                             return "/Sindh Board.png";
  if (n.includes("pre-school") || n.includes("preschool") || n.includes("pre school")) return "/Pre-School.png";
  if (n.includes("dictionar"))                                         return "/dictionary.png";
  if (n.includes("office"))                                            return "/office_supplies.png";
  if (n.includes("register") || n.includes("notebook"))               return "/Registers & Notebooks.png";
  if (n.includes("p.c") || n.includes("pc note") || n.includes("notes")) return "/P.C Notes.png";
  return "/slide1.png";
}

// ─── Smart meta resolver (case-insensitive) ────────────────────────────────
type SlideMeta = {
  badge: string;
  heading: string;
  subheading: string;
  ctaLabel: string;
  secondaryLabel: string;
  accent: string;
  align: "left" | "right";
};

function getCategoryMeta(name: string, index: number): SlideMeta {
  const n = name.toLowerCase();
  const side: "left" | "right" = index % 2 === 0 ? "left" : "right";

  if (n.includes("academic")) return {
    badge: "Academic Books", heading: "Excel in Your\nAcademic Journey",
    subheading: "University & college textbooks covering all subjects. Build a solid foundation for your academic success.",
    ctaLabel: "Shop Academic", secondaryLabel: "View All Books", accent: "#3b82f6", align: side,
  };
  if (n.includes("cambridge")) return {
    badge: "Cambridge O/A Levels", heading: "Ace Your\nCambridge Exams",
    subheading: "Complete O-Level and A-Level Cambridge book collections to help you achieve outstanding grades.",
    ctaLabel: "Shop Cambridge", secondaryLabel: "View All Books", accent: "#8b5cf6", align: side,
  };
  if (n.includes("sindh")) return {
    badge: "Sindh Board", heading: "School Books\nMade Easy",
    subheading: "All Sindh Board school textbooks for every class, available at the best prices in one place.",
    ctaLabel: "Shop Sindh Board", secondaryLabel: "View All Books", accent: "#10b981", align: side,
  };
  if (n.includes("pre-school") || n.includes("preschool") || n.includes("pre school")) return {
    badge: "Pre-School Learning", heading: "Fun Learning\nfor Little Ones",
    subheading: "Colorful, engaging books and activity sets designed to spark curiosity in young children.",
    ctaLabel: "Shop Pre-School", secondaryLabel: "View All Books", accent: "#f59e0b", align: side,
  };
  if (n.includes("dictionar")) return {
    badge: "Dictionaries & Reference", heading: "Words at Your\nFingertips",
    subheading: "Comprehensive dictionaries and reference books for students, professionals, and language enthusiasts.",
    ctaLabel: "Shop Dictionaries", secondaryLabel: "View All Books", accent: "#e1711c", align: side,
  };
  if (n.includes("office")) return {
    badge: "Office Supplies", heading: "Equip Your\nWorkspace",
    subheading: "Premium stationery and office supplies to keep you organized and productive every single day.",
    ctaLabel: "Shop Office Supplies", secondaryLabel: "View All Books", accent: "#64748b", align: side,
  };
  if (n.includes("register") || n.includes("notebook")) return {
    badge: "Registers & Notebooks", heading: "Write Your\nIdeas Down",
    subheading: "High-quality notebooks, registers and diaries for students and professionals.",
    ctaLabel: "Shop Notebooks", secondaryLabel: "View All Books", accent: "#06b6d4", align: side,
  };
  if (n.includes("p.c") || n.includes("pc note") || n.includes("notes")) return {
    badge: "P.C Notes", heading: "Smart Notes for\nSmart Students",
    subheading: "Carefully curated printed course notes and study guides to help you prepare faster and score higher.",
    ctaLabel: "Shop P.C Notes", secondaryLabel: "View All Books", accent: "#ec4899", align: side,
  };
  // Default fallback
  return {
    badge: name, heading: `Explore\n${name}`,
    subheading: `Browse our wide selection of ${name} books at the best prices.`,
    ctaLabel: `Shop ${name}`, secondaryLabel: "View All Books", accent: "#e1711c", align: side,
  };
}

// ─── HeroSection ───────────────────────────────────────────────────────────
const HeroSection = () => {
  const { data: categories } = useCategories();
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [visible, setVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Build slides: first = All Books hero, rest = one per category
  const slides = [
    {
      id: "all-books",
      image: "/slide1.png",
      badge: "Welcome to Suleman Books",
      heading: "Discover Your Next\nFavorite Book",
      subheading: "Explore thousands of books across every genre. From bestsellers to rare finds — your perfect read awaits.",
      ctaLabel: "Shop Now",
      ctaHref: "/books",
      secondaryLabel: "Browse Categories",
      secondaryHref: "/books",
      accent: "#e1711c",
      align: "left" as "left" | "right",
    },
    ...(categories || []).map((cat, index) => {
      const meta = getCategoryMeta(cat.name, index);
      const image = getCategoryImage(cat.name);
      return {
        id: cat._id,
        image,
        badge: meta.badge,
        heading: meta.heading,
        subheading: meta.subheading,
        ctaLabel: meta.ctaLabel,
        ctaHref: `/books?category=${cat._id}`,
        secondaryLabel: meta.secondaryLabel,
        secondaryHref: "/books",
        accent: meta.accent,
        align: meta.align,
      };
    }),
  ];

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const goTo = useCallback(
    (index: number) => {
      if (animating || index === current) return;
      setAnimating(true);
      setVisible(false);
      setTimeout(() => {
        setCurrent(index);
        setVisible(true);
        setAnimating(false);
      }, 450);
    },
    [animating, current]
  );

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, goTo, slides.length]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, goTo, slides.length]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(next, 5500);
  }, [next]);

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [resetTimer]);

  const slide = slides[current];
  const isRight = !isMobile && slide.align === "right";
  const isCentered = isMobile;

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: isMobile ? "clamp(400px, 85vw, 600px)" : "clamp(600px, 85vh, 950px)" }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={encodeURI(slide.image)}
          alt={slide.badge}
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center",
            transition: "opacity 0.45s ease",
            opacity: visible ? 1 : 0,
          }}
        />

        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: isCentered
              ? "rgba(10,10,20,0.50)"
              : isRight
              ? "linear-gradient(to left, rgba(10,10,20,0.80) 0%, rgba(10,10,20,0.40) 48%, rgba(10,10,20,0.0) 100%)"
              : "linear-gradient(to right, rgba(10,10,20,0.80) 0%, rgba(10,10,20,0.40) 48%, rgba(10,10,20,0.0) 100%)",
          }}
        />

        {/* Bottom fade */}
        <div
          className="absolute inset-x-0 bottom-0"
          style={{ height: 80, background: "linear-gradient(to top, rgba(10,10,20,0.3) 0%, transparent 100%)" }}
        />
      </div>

      {/* Content */}
      <div
        className="relative h-full flex items-center"
        style={{ padding: isMobile ? "60px 24px" : `clamp(60px, 8vw, 100px) clamp(32px, 7vw, 120px)` }}
      >
        <div
          className="flex flex-col"
          style={{
            width: isMobile ? "100%" : "clamp(300px, 48%, 580px)",
            marginLeft: isRight ? "auto" : 0,
            marginRight: isRight ? 0 : isCentered ? "auto" : 0,
            textAlign: isCentered ? "center" : "left",
            alignItems: isCentered ? "center" : "flex-start",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.45s ease 0.05s, transform 0.45s ease 0.05s",
          }}
        >
          {/* Badge */}
          <div
            className="inline-flex items-center font-semibold"
            style={{
              background: `${slide.accent}25`,
              border: `1px solid ${slide.accent}70`,
              color: slide.accent,
              borderRadius: 999,
              padding: isMobile ? "4px 14px" : "5px 18px",
              fontSize: isMobile ? 11 : "clamp(11px, 1.2vw, 13px)",
              letterSpacing: "0.5px",
              marginBottom: isMobile ? 12 : "clamp(12px, 1.5vw, 18px)",
            }}
          >
            {slide.badge}
          </div>

          {/* Heading */}
          <h1
            className="font-extrabold text-white leading-tight whitespace-pre-line"
            style={{
              fontSize: isMobile ? "clamp(22px, 7vw, 34px)" : "clamp(28px, 4.5vw, 58px)",
              marginBottom: isMobile ? 10 : "clamp(12px, 1.5vw, 18px)",
              textShadow: "0 2px 20px rgba(0,0,0,0.6)",
            }}
          >
            {slide.heading}
          </h1>

          {/* Accent line */}
          <div style={{ width: 50, height: 3, borderRadius: 999, background: slide.accent, marginBottom: isMobile ? 12 : "clamp(14px, 1.8vw, 20px)" }} />

          {/* Subheading — hidden on very small screens */}
          <p
            className="text-gray-300 leading-relaxed hidden sm:block"
            style={{
              fontSize: isMobile ? 13 : "clamp(13px, 1.4vw, 17px)",
              marginBottom: isMobile ? 20 : "clamp(24px, 3.5vw, 40px)",
              maxWidth: isCentered ? 420 : 480,
            }}
          >
            {slide.subheading}
          </p>

          {/* Subheading short — only on very small screens */}
          <p
            className="text-gray-300 leading-relaxed block sm:hidden"
            style={{ fontSize: 12, marginBottom: 18, maxWidth: 320 }}
          >
            {slide.subheading.split("—")[0]}
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap items-center" style={{ gap: isMobile ? 10 : "clamp(10px, 1.5vw, 16px)" }}>
            <Link
              href={slide.ctaHref}
              className="inline-flex items-center font-bold text-white hover:opacity-90 transition-all active:scale-95"
              style={{
                background: slide.accent, borderRadius: 8,
                padding: isMobile ? "8px 14px" : "clamp(11px, 1.3vw, 15px) clamp(20px, 2.5vw, 32px)",
                fontSize: isMobile ? 12 : "clamp(13px, 1.3vw, 15px)",
                boxShadow: `0 4px 18px ${slide.accent}55`, gap: 6,
              }}
            >
              {slide.ctaLabel}
              <ArrowRight size={isMobile ? 12 : 16} strokeWidth={2.5} />
            </Link>
            <Link
              href={slide.secondaryHref}
              className="inline-flex items-center font-semibold text-white hover:text-white/80 transition-all active:scale-95"
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: 8,
                padding: isMobile ? "8px 14px" : "clamp(11px, 1.3vw, 15px) clamp(20px, 2.5vw, 32px)",
                fontSize: isMobile ? 12 : "clamp(13px, 1.3vw, 15px)",
                backdropFilter: "blur(6px)",
              }}
            >
              {slide.secondaryLabel}
            </Link>
          </div>
        </div>
      </div>

      {/* Prev Arrow */}
      <button
        onClick={() => { prev(); resetTimer(); }}
        aria-label="Previous slide"
        className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95"
        style={{
          left: isMobile ? 10 : "clamp(12px, 2vw, 28px)",
          width: isMobile ? 36 : "clamp(38px, 4vw, 52px)",
          height: isMobile ? 36 : "clamp(38px, 4vw, 52px)",
          borderRadius: "50%", background: "rgba(255,255,255,0.12)",
          border: "1px solid rgba(255,255,255,0.2)", backdropFilter: "blur(8px)",
        }}
      >
        <ChevronLeft size={isMobile ? 18 : 22} strokeWidth={2.5} />
      </button>

      {/* Next Arrow */}
      <button
        onClick={() => { next(); resetTimer(); }}
        aria-label="Next slide"
        className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95"
        style={{
          right: isMobile ? 10 : "clamp(12px, 2vw, 28px)",
          width: isMobile ? 36 : "clamp(38px, 4vw, 52px)",
          height: isMobile ? 36 : "clamp(38px, 4vw, 52px)",
          borderRadius: "50%", background: "rgba(255,255,255,0.12)",
          border: "1px solid rgba(255,255,255,0.2)", backdropFilter: "blur(8px)",
        }}
      >
        <ChevronRight size={isMobile ? 18 : 22} strokeWidth={2.5} />
      </button>

      {/* Dots */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center" style={{ bottom: isMobile ? 12 : 20, gap: 8 }}>
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => { goTo(i); resetTimer(); }}
            aria-label={`Go to slide ${i + 1}`}
            style={{
              width: i === current ? (isMobile ? 24 : "clamp(28px, 3vw, 36px)") : (isMobile ? 8 : "clamp(8px, 1vw, 10px)"),
              height: isMobile ? 8 : "clamp(8px, 0.9vw, 10px)",
              borderRadius: 999,
              background: i === current ? slide.accent : "rgba(255,255,255,0.3)",
              border: "none", cursor: "pointer",
              transition: "all 0.35s ease",
              boxShadow: i === current ? `0 0 8px ${slide.accent}99` : "none",
            }}
          />
        ))}
      </div>

      {/* Slide counter */}
      {!isMobile && (
        <div
          className="absolute font-bold text-white/40"
          style={{ bottom: 20, right: "clamp(16px, 2.5vw, 32px)", fontSize: "clamp(11px, 1.2vw, 13px)", letterSpacing: "1px" }}
        >
          {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
        </div>
      )}

      {/* Progress bar */}
      <div
        className="absolute bottom-0 left-0 h-[3px]"
        style={{
          background: slide.accent,
          width: `${((current + 1) / slides.length) * 100}%`,
          transition: "width 0.4s ease, background 0.4s ease",
          boxShadow: `0 0 8px ${slide.accent}`,
        }}
      />
    </section>
  );
};

export default HeroSection;
