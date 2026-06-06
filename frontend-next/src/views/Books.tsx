"use client";
// src/pages/Books.tsx
import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"

import { Search, SlidersHorizontal, X, BookOpen } from "lucide-react"
import { useBooksList } from "../hooks/useBooks"
import { useCategories } from "../hooks/useCategories"
import BookCard from "../components/books/BooksCard"
import type{ Book } from "../types"

const Books = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [search,    setSearch]    = useState(searchParams?.get("search") || "")
    const [category,  setCategory]  = useState(searchParams?.get("category") || "")
    const [language,  setLanguage]  = useState("")
    const [sortBy,    setSortBy]    = useState("createdAt")
    const [sortOrder, setSortOrder] = useState("desc")
    const [page,      setPage]      = useState(1)
    const [showFilter, setShowFilter] = useState(false)

    // Sync state when URL searchParams change
    useEffect(() => {
        setCategory(searchParams?.get("category") || "")
        setSearch(searchParams?.get("search") || "")
        setPage(1)
    }, [searchParams])

    const limit = 15

    const { data, isLoading } = useBooksList(
        search, category, language, sortBy, sortOrder, page, limit
    )

    const { data: categories } = useCategories()

    const books: Book[]  = data?.books      || []
    const total: number  = data?.total      || 0
    const totalPages     = data?.totalPages || 1

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setPage(1)
        const params = new URLSearchParams(searchParams.toString())
        if (search) params.set("search", search)
        else params.delete("search")
        router.push(`/books${params.toString() ? `?${params.toString()}` : ""}`)
    }

    const clearFilters = () => {
        setSearch("")
        setCategory("")
        setLanguage("")
        setSortBy("createdAt")
        setSortOrder("desc")
        setPage(1)
        router.push("/books")
    }

    return (
        <main style={{
            minHeight: "100vh",
            background: "#f3f4f6", // matching landing page background
            position: "relative",
            overflow: "hidden",
            paddingBottom: "100px"
        }}>
            {/* Decorative Background Blobs (same as Home page sections) */}
            <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(251,191,36,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", top: 300, left: -80, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />

            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px", position: "relative" }}>
                
                {/* ── Header Area ── */}
                <div style={{
                    display: "flex", flexDirection: "column", gap: 20,
                    marginBottom: 40, borderBottom: "1px solid rgba(0,0,0,0.06)",
                    paddingBottom: 30
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20 }}>
                        <div>
                            {/* Premium Badge */}
                            <div style={{
                                display: "inline-flex", alignItems: "center", gap: 7,
                                background: "linear-gradient(135deg, #fff7ed, #ffedd5)",
                                color: "#f97316", padding: "7px 16px",
                                borderRadius: 999, fontSize: 12, fontWeight: 700,
                                textTransform: "uppercase", letterSpacing: "0.07em",
                                marginBottom: 14, border: "1px solid #fed7aa",
                                boxShadow: "0 2px 10px rgba(249,115,22,0.15)"
                            }}>
                                <BookOpen size={13} /> Our Collection
                            </div>

                            <h1 style={{
                                margin: 0, fontSize: "clamp(28px, 4vw, 42px)",
                                fontWeight: 800, color: "#111827", lineHeight: 1.15,
                                letterSpacing: "-0.5px"
                            }}>
                                Explore All{" "}
                                <span style={{
                                    background: "linear-gradient(135deg, #f97316, #fb923c)",
                                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                                    backgroundClip: "text"
                                }}>
                                    Books
                                </span>
                            </h1>
                            <p style={{ margin: "10px 0 0", fontSize: 15, color: "#6b7280", fontWeight: 500 }}>
                                Showing {total} results found
                            </p>
                        </div>

                        {/* Search & Filter Buttons */}
                        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                            <form
                                onSubmit={handleSearch}
                                style={{
                                    display: "flex", alignItems: "center", gap: 8,
                                    background: "#fff", padding: "10px 16px",
                                    borderRadius: 14, border: "1px solid #e5e7eb",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                                    width: "100%", maxWidth: 300,
                                }}
                                className="focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 transition-all"
                            >
                                <Search size={18} color="#9ca3af" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        setPage(1);
                                    }}
                                    placeholder="Search books..."
                                    style={{ border: "none", outline: "none", background: "transparent", fontSize: 14, flex: 1, color: "#1f2937" }}
                                />
                                {search && (
                                    <button type="button" onClick={() => { setSearch(""); setPage(1) }} style={{ outline: "none" }}>
                                        <X size={16} color="#9ca3af" className="hover:text-red-500 transition-colors" />
                                    </button>
                                )}
                            </form>

                            <button
                                onClick={() => setShowFilter(!showFilter)}
                                style={{
                                    display: "flex", alignItems: "center", gap: 8,
                                    background: showFilter ? "#fff7ed" : "#fff",
                                    color: showFilter ? "#f97316" : "#4b5563",
                                    border: showFilter ? "1px solid #fdba74" : "1px solid #e5e7eb",
                                    padding: "10px 20px", borderRadius: 14,
                                    fontSize: 14, fontWeight: 600,
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                                    transition: "all .2s ease",
                                    cursor: "pointer"
                                }}
                                className="hover:border-orange-400 hover:text-orange-600"
                            >
                                <SlidersHorizontal size={18} /> Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Filters Panel ── */}
                <div style={{
                    overflow: "hidden",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    maxHeight: showFilter ? "500px" : "0px",
                    opacity: showFilter ? 1 : 0,
                    marginBottom: showFilter ? 32 : 0,
                }}>
                    <div style={{
                        background: "#fff", borderRadius: 20, padding: 24,
                        border: "1px solid #e5e7eb", boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
                        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: 20
                    }}>
                        {/* Category Filter */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            <label style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                Category
                            </label>
                            <select
                                value={category}
                                onChange={(e) => { setCategory(e.target.value); setPage(1) }}
                                style={{
                                    padding: "12px 14px", borderRadius: 12, border: "1px solid #e5e7eb",
                                    background: "#f9fafb", fontSize: 14, color: "#374151",
                                    outline: "none", cursor: "pointer", transition: "border .2s"
                                }}
                                className="focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
                            >
                                <option value="">All Categories</option>
                                {categories?.map(cat => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Language Filter */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            <label style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                Language
                            </label>
                            <select
                                value={language}
                                onChange={(e) => { setLanguage(e.target.value); setPage(1) }}
                                style={{
                                    padding: "12px 14px", borderRadius: 12, border: "1px solid #e5e7eb",
                                    background: "#f9fafb", fontSize: 14, color: "#374151",
                                    outline: "none", cursor: "pointer", transition: "border .2s"
                                }}
                                className="focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
                            >
                                <option value="">All Languages</option>
                                <option value="English">English</option>
                                <option value="Urdu">Urdu</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Sort By Filter */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            <label style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                Sort By
                            </label>
                            <select
                                value={sortBy}
                                onChange={(e) => { setSortBy(e.target.value); setPage(1) }}
                                style={{
                                    padding: "12px 14px", borderRadius: 12, border: "1px solid #e5e7eb",
                                    background: "#f9fafb", fontSize: 14, color: "#374151",
                                    outline: "none", cursor: "pointer", transition: "border .2s"
                                }}
                                className="focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
                            >
                                <option value="createdAt">Latest Arrivals</option>
                                <option value="price">Price</option>
                                <option value="ratingsAverage">Highest Rated</option>
                            </select>
                        </div>

                        {/* Order Filter */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            <label style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                Order
                            </label>
                            <select
                                value={sortOrder}
                                onChange={(e) => { setSortOrder(e.target.value); setPage(1) }}
                                style={{
                                    padding: "12px 14px", borderRadius: 12, border: "1px solid #e5e7eb",
                                    background: "#f9fafb", fontSize: 14, color: "#374151",
                                    outline: "none", cursor: "pointer", transition: "border .2s"
                                }}
                                className="focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
                            >
                                <option value="desc">High to Low (Z-A)</option>
                                <option value="asc">Low to High (A-Z)</option>
                            </select>
                        </div>

                        {/* Clear Button */}
                        <div style={{ display: "flex", alignItems: "flex-end", paddingBottom: 2 }}>
                            <button
                                onClick={clearFilters}
                                style={{
                                    background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca",
                                    padding: "12px 20px", borderRadius: 12, fontSize: 14, fontWeight: 600,
                                    width: "100%", cursor: "pointer", transition: "all .2s ease"
                                }}
                                className="hover:bg-red-500 hover:text-white"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Books Grid ── */}
                {isLoading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-7">
                        {[...Array(15)].map((_, i) => (
                            <div key={i} style={{ background: "#e5e7eb", borderRadius: 20, aspectRatio: "3/4", animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite", animationDelay: `${i * 0.1}s` }} />
                        ))}
                    </div>
                ) : books.length === 0 ? (
                    <div style={{
                        background: "#fff", borderRadius: 24, border: "1px dashed #d1d5db",
                        padding: "80px 20px", display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center", textAlign: "center",
                        boxShadow: "0 10px 40px rgba(0,0,0,0.03)"
                    }}>
                        <div style={{ fontSize: 64, marginBottom: 20 }}>📚</div>
                        <h3 style={{ margin: "0 0 10px", fontSize: 24, fontWeight: 700, color: "#111827" }}>No books found</h3>
                        <p style={{ margin: "0 0 24px", color: "#6b7280", maxWidth: 400, lineHeight: 1.6 }}>
                            We couldn't find any books matching your current filters. Try adjusting your search criteria.
                        </p>
                        <button
                            onClick={clearFilters}
                            style={{
                                background: "linear-gradient(135deg, #f97316, #fb923c)", color: "#fff",
                                border: "none", padding: "12px 24px", borderRadius: 12,
                                fontSize: 15, fontWeight: 700, cursor: "pointer",
                                boxShadow: "0 4px 14px rgba(249,115,22,0.3)",
                                transition: "transform .2s ease"
                            }}
                            className="hover:scale-105 active:scale-95"
                        >
                            Reset All Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-7">
                        {books.map(book => (
                            <BookCard key={book._id} book={book} />
                        ))}
                    </div>
                )}

                {/* ── Pagination ── */}
                {totalPages > 1 && (
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10, marginTop: 60 }}>
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            style={{
                                padding: "10px 18px", borderRadius: 12, fontSize: 14, fontWeight: 600,
                                background: page === 1 ? "#f3f4f6" : "#fff",
                                color: page === 1 ? "#9ca3af" : "#374151",
                                border: "1px solid", borderColor: page === 1 ? "transparent" : "#e5e7eb",
                                cursor: page === 1 ? "not-allowed" : "pointer",
                                transition: "all .2s ease"
                            }}
                            className={page === 1 ? "" : "hover:border-orange-400 hover:text-orange-600"}
                        >
                            Prev
                        </button>

                        <div style={{ display: "flex", gap: 6 }}>
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setPage(i + 1)}
                                    style={{
                                        width: 40, height: 40, borderRadius: 12, fontSize: 14, fontWeight: 700,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        background: page === i + 1 ? "#f97316" : "#fff",
                                        color: page === i + 1 ? "#fff" : "#4b5563",
                                        border: page === i + 1 ? "none" : "1px solid #e5e7eb",
                                        cursor: "pointer", transition: "all .2s ease",
                                        boxShadow: page === i + 1 ? "0 4px 12px rgba(249,115,22,0.3)" : "none"
                                    }}
                                    className={page === i + 1 ? "" : "hover:border-orange-400 hover:text-orange-600"}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            style={{
                                padding: "10px 18px", borderRadius: 12, fontSize: 14, fontWeight: 600,
                                background: page === totalPages ? "#f3f4f6" : "#fff",
                                color: page === totalPages ? "#9ca3af" : "#374151",
                                border: "1px solid", borderColor: page === totalPages ? "transparent" : "#e5e7eb",
                                cursor: page === totalPages ? "not-allowed" : "pointer",
                                transition: "all .2s ease"
                            }}
                            className={page === totalPages ? "" : "hover:border-orange-400 hover:text-orange-600"}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
            <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .45; } }`}</style>
        </main>
    )
}

export default Books