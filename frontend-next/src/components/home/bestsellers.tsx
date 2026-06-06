"use client";
// src/components/home/Bestsellers.tsx
import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react"
import { useBestsellers } from "../../hooks/useBooks"
import BookCard from "../books/BooksCard"

const Bestsellers = () => {
    const { data: books, isLoading } = useBestsellers()

    if (isLoading) {
        return (
            <section style={{ padding: "80px 0", background: "#f3f4f6", position: "relative" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
                    <div style={{ marginBottom: 48 }}>
                        <div style={{ width: 120, height: 28, borderRadius: 999, background: "#e5e7eb", marginBottom: 14, animation: "pulse 2s infinite" }} />
                        <div style={{ width: 220, height: 36, borderRadius: 12, background: "#e5e7eb", animation: "pulse 2s infinite" }} />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-7">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} style={{ background: "#e5e7eb", borderRadius: 20, aspectRatio: "3/4", animation: "pulse 2s infinite", animationDelay: `${i * 0.1}s` }} />
                        ))}
                    </div>
                </div>
            </section>
        )
    }

    if (!books?.length) return null

    return (
        <section style={{
            padding: "90px 0 100px",
            background: "#f3f4f6",
            position: "relative",
            overflow: "hidden"
        }}>
            {/* Decorative background blobs */}
            <div style={{ position: "absolute", top: -80, left: -80, width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(251,191,36,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />

            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative" }}>
                {/* ── Section Header ── */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 52, flexWrap: "wrap", gap: 20 }}>
                    <div>
                        {/* Badge */}
                        <div style={{
                            display: "inline-flex", alignItems: "center", gap: 7,
                            background: "linear-gradient(135deg, #fef2f2, #fee2e2)",
                            color: "#ef4444", padding: "7px 16px",
                            borderRadius: 999, fontSize: 12, fontWeight: 700,
                            textTransform: "uppercase", letterSpacing: "0.07em",
                            marginBottom: 14, border: "1px solid #fecaca",
                            boxShadow: "0 2px 10px rgba(239,68,68,0.15)"
                        }}>
                            <Flame size={13} /> Hot Right Now
                        </div>

                        {/* Heading */}
                        <h2 style={{
                            margin: 0, fontSize: "clamp(26px, 4vw, 36px)",
                            fontWeight: 800, color: "#111827", lineHeight: 1.15,
                            letterSpacing: "-0.5px"
                        }}>
                            Global{" "}
                            <span style={{
                                background: "linear-gradient(135deg, #ef4444, #f97316)",
                                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                                backgroundClip: "text"
                            }}>
                                Bestsellers
                            </span>
                        </h2>

                        {/* Subtitle */}
                        <p style={{ margin: "10px 0 0", fontSize: 15, color: "#6b7280", fontWeight: 400, lineHeight: 1.5 }}>
                            The most popular books everyone is reading
                        </p>
                    </div>

                    {/* View All link */}
                    <Link
                        href="/books?sort=bestseller"
                        style={{
                            display: "inline-flex", alignItems: "center", gap: 8,
                            background: "linear-gradient(135deg, #ef4444, #f97316)",
                            color: "#fff", fontWeight: 700, fontSize: 14,
                            textDecoration: "none", padding: "11px 22px",
                            borderRadius: 12, transition: "all .25s ease",
                            boxShadow: "0 4px 14px rgba(239,68,68,0.35)",
                            whiteSpace: "nowrap"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-2px)"
                            e.currentTarget.style.boxShadow = "0 8px 20px rgba(239,68,68,0.45)"
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)"
                            e.currentTarget.style.boxShadow = "0 4px 14px rgba(239,68,68,0.35)"
                        }}
                    >
                        View Bestsellers <ArrowRight size={16} />
                    </Link>
                </div>

                {/* ── Divider ── */}
                <div style={{
                    width: "100%", height: 1,
                    background: "linear-gradient(90deg, transparent, #fecaca 30%, #fecaca 70%, transparent)",
                    marginBottom: 48
                }} />

                {/* ── Books Grid ── */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-7">
                    {books.map(book => (
                        <BookCard key={book._id} book={book} />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Bestsellers