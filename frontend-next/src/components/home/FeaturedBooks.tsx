"use client";
import { useFeaturedBooks } from "../../hooks/useBooks"
import BookCard from "../books/BooksCard"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

const FeaturedBooks = () => {
    const { data: books, isLoading } = useFeaturedBooks()

    if (isLoading) {
        return (
            <section style={{
                padding: "80px 0",
                background: "#f3f4f6",
                position: "relative",
                overflow: "hidden"
            }}>
                {/* Decorative background blobs */}
                <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(251,191,36,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", bottom: -60, left: -60, width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />

                <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
                    {/* Skeleton header */}
                    <div style={{ marginBottom: 48 }}>
                        <div style={{ width: 120, height: 28, borderRadius: 999, background: "#e5e7eb", marginBottom: 14, animation: "pulse 2s infinite" }} />
                        <div style={{ width: 220, height: 36, borderRadius: 12, background: "#e5e7eb", animation: "pulse 2s infinite" }} />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-7">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} style={{ background: "#e5e7eb", borderRadius: 20, aspectRatio: "3/4", animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite", animationDelay: `${i * 0.1}s` }} />
                        ))}
                    </div>
                </div>
                <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .45; } }`}</style>
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
            {/* Decorative blobs */}
            <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(251,191,36,0.14) 0%, transparent 70%)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: -80, left: -80, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />

            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative" }}>

                {/* ── Section Header ── */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 52, flexWrap: "wrap", gap: 20 }}>
                    <div>
                        {/* Badge */}
                        <div style={{
                            display: "inline-flex", alignItems: "center", gap: 7,
                            background: "linear-gradient(135deg, #fff7ed, #ffedd5)",
                            color: "#f97316", padding: "7px 16px",
                            borderRadius: 999, fontSize: 12, fontWeight: 700,
                            textTransform: "uppercase", letterSpacing: "0.07em",
                            marginBottom: 14, border: "1px solid #fed7aa",
                            boxShadow: "0 2px 10px rgba(249,115,22,0.15)"
                        }}>
                            <Sparkles size={13} /> Our Top Picks
                        </div>

                        {/* Heading */}
                        <h2 style={{
                            margin: 0, fontSize: "clamp(26px, 4vw, 36px)",
                            fontWeight: 800, color: "#111827", lineHeight: 1.15,
                            letterSpacing: "-0.5px"
                        }}>
                            Featured{" "}
                            <span style={{
                                background: "linear-gradient(135deg, #f97316, #fb923c)",
                                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                                backgroundClip: "text"
                            }}>
                                Books
                            </span>
                        </h2>

                        {/* Subtitle */}
                        <p style={{ margin: "10px 0 0", fontSize: 15, color: "#6b7280", fontWeight: 400, lineHeight: 1.5 }}>
                            Hand-picked titles loved by our readers
                        </p>
                    </div>

                    {/* Explore All link */}
                    <Link
                        href="/books"
                        style={{
                            display: "inline-flex", alignItems: "center", gap: 8,
                            background: "linear-gradient(135deg, #f97316, #fb923c)",
                            color: "#fff", fontWeight: 700, fontSize: 14,
                            textDecoration: "none", padding: "11px 22px",
                            borderRadius: 12, transition: "all .25s ease",
                            boxShadow: "0 4px 14px rgba(249,115,22,0.35)",
                            whiteSpace: "nowrap"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-2px)"
                            e.currentTarget.style.boxShadow = "0 8px 20px rgba(249,115,22,0.45)"
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)"
                            e.currentTarget.style.boxShadow = "0 4px 14px rgba(249,115,22,0.35)"
                        }}
                    >
                        Explore All <ArrowRight size={16} />
                    </Link>
                </div>

                {/* ── Divider ── */}
                <div style={{
                    width: "100%", height: 1,
                    background: "linear-gradient(90deg, transparent, #fed7aa 30%, #fed7aa 70%, transparent)",
                    marginBottom: 48
                }} />

                {/* ── Books Grid ── */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-7">
                    {books.map(book => (
                        <BookCard key={book._id} book={book} />
                    ))}
                </div>

                {/* ── Bottom CTA ── */}
                <div style={{ textAlign: "center", marginTop: 60 }}>
                    <Link
                        href="/books"
                        style={{
                            display: "inline-flex", alignItems: "center", gap: 8,
                            color: "#f97316", fontWeight: 700, fontSize: 14,
                            textDecoration: "none", padding: "11px 28px",
                            borderRadius: 12, border: "2px solid #fed7aa",
                            background: "#fff", transition: "all .25s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#fff7ed"
                            e.currentTarget.style.borderColor = "#f97316"
                            e.currentTarget.style.transform = "translateY(-2px)"
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "#fff"
                            e.currentTarget.style.borderColor = "#fed7aa"
                            e.currentTarget.style.transform = "translateY(0)"
                        }}
                    >
                        View All Books <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default FeaturedBooks