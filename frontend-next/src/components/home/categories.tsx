"use client";
// src/components/home/Categories.tsx
import Link from "next/link";
import { BookOpen, Grid3X3 } from "lucide-react"
import { useCategories } from "../../hooks/useCategories"

/* Cycle through these accent colours for category icons */
const ACCENT_COLORS = [
    { bg: "#fff7ed", hover: "#f97316", icon: "#f97316" },
    { bg: "#eff6ff", hover: "#3b82f6", icon: "#3b82f6" },
    { bg: "#f0fdf4", hover: "#22c55e", icon: "#22c55e" },
    { bg: "#fdf4ff", hover: "#a855f7", icon: "#a855f7" },
    { bg: "#fff1f2", hover: "#f43f5e", icon: "#f43f5e" },
    { bg: "#ecfdf5", hover: "#10b981", icon: "#10b981" },
]

const Categories = () => {
    const { data: categories, isLoading } = useCategories()

    if (isLoading) {
        return (
            <section style={{ background: "#FFFBF5", padding: "80px 0" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
                    <div style={{ textAlign: "center", marginBottom: 48 }}>
                        <div style={{ width: 140, height: 28, borderRadius: 999, background: "#e5e7eb", margin: "0 auto 14px", animation: "pulse 2s infinite" }} />
                        <div style={{ width: 200, height: 20, borderRadius: 8, background: "#e5e7eb", margin: "0 auto", animation: "pulse 2s infinite" }} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, maxWidth: 800, margin: "0 auto" }}>
                        {[...Array(8)].map((_, i) => (
                            <div key={i} style={{ background: "#e5e7eb", borderRadius: 20, height: 140, animation: "pulse 2s infinite", animationDelay: `${i * 0.1}s` }} />
                        ))}
                    </div>
                </div>
                <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .45; } }`}</style>
            </section>
        )
    }

    if (!categories?.length) return null

    return (
        <section style={{ background: "#FFFBF5", padding: "90px 0 100px", position: "relative", overflow: "hidden" }}>

            {/* Subtle decorative circle */}
            <div style={{ position: "absolute", top: -120, left: "50%", transform: "translateX(-50%)", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(249,115,22,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative" }}>

                {/* ── Section Header ── */}
                <div style={{ textAlign: "center", marginBottom: 56 }}>
                    {/* Badge */}
                    <div style={{
                        display: "inline-flex", alignItems: "center", gap: 7,
                        background: "linear-gradient(135deg, #fff7ed, #ffedd5)",
                        color: "#f97316", padding: "7px 18px",
                        borderRadius: 999, fontSize: 12, fontWeight: 700,
                        textTransform: "uppercase", letterSpacing: "0.07em",
                        marginBottom: 16, border: "1px solid #fed7aa",
                        boxShadow: "0 2px 10px rgba(249,115,22,0.12)"
                    }}>
                        <Grid3X3 size={13} /> Collections
                    </div>

                    {/* Heading */}
                    <h2 style={{
                        margin: 0, fontSize: "clamp(26px, 4vw, 36px)",
                        fontWeight: 800, color: "#111827",
                        lineHeight: 1.15, letterSpacing: "-0.5px"
                    }}>
                        Browse by{" "}
                        <span style={{
                            background: "linear-gradient(135deg, #f97316, #fb923c)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text"
                        }}>
                            Category
                        </span>
                    </h2>

                    {/* Sub-text */}
                    <p style={{ margin: "12px 0 0", fontSize: 15, color: "#6b7280", fontWeight: 400 }}>
                        Find your perfect book from our curated collections
                    </p>

                    {/* Underline accent */}
                    <div style={{
                        width: 60, height: 4, borderRadius: 99,
                        background: "linear-gradient(90deg, #f97316, #fb923c)",
                        margin: "20px auto 0"
                    }} />
                </div>

                {/* ── Category Cards Grid — 4 columns × 2 rows, centred ── */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                    gap: 20,
                    maxWidth: 820,
                    margin: "0 auto"
                }} className="categories-grid">
                    {categories.map((cat, index) => {
                        const accent = ACCENT_COLORS[index % ACCENT_COLORS.length]
                        return (
                            <CategoryCard key={cat._id} cat={cat} accent={accent} />
                        )
                    })}
                </div>
                <style>{`
                    @media (max-width: 640px)  { .categories-grid { grid-template-columns: repeat(2, minmax(0,1fr)) !important; } }
                    @media (min-width: 641px) and (max-width: 900px) { .categories-grid { grid-template-columns: repeat(4, minmax(0,1fr)) !important; } }
                `}</style>
            </div>
        </section>
    )
}

/* ── Individual card extracted for hover state management ── */
function CategoryCard({ cat, accent }: { cat: any, accent: typeof ACCENT_COLORS[0] }) {
    const [hovered, setHovered] = (
        // eslint-disable-next-line react-hooks/rules-of-hooks
        require("react").useState(false)
    )

    return (
        <Link
            href={`/books?category=${cat._id}`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                display: "flex", flexDirection: "column",
                alignItems: "center", gap: 14,
                background: hovered ? accent.hover : "#fff",
                borderRadius: 20, padding: "28px 16px 24px",
                border: `1.5px solid ${hovered ? accent.hover : "#f0ede9"}`,
                textDecoration: "none",
                transition: "all .25s ease",
                transform: hovered ? "translateY(-6px)" : "translateY(0)",
                boxShadow: hovered
                    ? `0 16px 32px rgba(0,0,0,0.12)`
                    : "0 2px 10px rgba(0,0,0,0.04)",
                cursor: "pointer"
            }}
        >
            {/* Icon circle */}
            <div style={{
                width: 60, height: 60, borderRadius: "50%",
                background: hovered ? "rgba(255,255,255,0.2)" : accent.bg,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all .25s ease",
                flexShrink: 0
            }}>
                {cat.image ? (
                    <img
                        src={cat.image}
                        alt={cat.name}
                        style={{
                            width: 34, height: 34, objectFit: "contain",
                            filter: hovered ? "brightness(0) invert(1)" : "none",
                            transition: "filter .25s ease"
                        }}
                    />
                ) : (
                    <BookOpen
                        size={26}
                        color={hovered ? "#fff" : accent.icon}
                        style={{ transition: "color .25s ease" }}
                    />
                )}
            </div>

            {/* Label */}
            <span style={{
                fontSize: 13, fontWeight: 700,
                color: hovered ? "#fff" : "#374151",
                textAlign: "center", lineHeight: 1.4,
                transition: "color .25s ease"
            }}>
                {cat.name}
            </span>
        </Link>
    )
}

export default Categories