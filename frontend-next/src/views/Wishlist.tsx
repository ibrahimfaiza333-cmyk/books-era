"use client";
import { Heart, Trash2, ShoppingCart, BookOpen, Image as ImageIcon } from "lucide-react"
import Link from "next/link"
import PageSpinner from "../components/common/PageSpinner"
import { useWishlist } from "../hooks/useWishlist"
import { useCart } from "../hooks/useCart"
import { toastApiError } from "../lib/api-error"
import { toast } from "react-toastify";

const Wishlist = () => {
    const { wishlist, isLoading, removeFromWishlist } = useWishlist()
    const { addToCart } = useCart()

    const handleRemove = async (bookId: string) => {
        try {
            await removeFromWishlist(bookId)
            toast.success("Removed from wishlist!")
        } catch {
            toast.error("Failed!")
        }
    }

    const handleAddToCart = async (bookId: string) => {
        try {
            await addToCart({ bookId, quantity: 1 })
            toast.success("Added to cart!")
        } catch (error: unknown) {
            toastApiError(error)
        }
    }

    if (isLoading) return <PageSpinner />

    return (
        <div style={{ minHeight: "calc(100vh - 64px)", width: "100%", background: "#F5F3EF" }}>

            {/* ── Banner ─────────────────────────────────── */}
            <div style={{ background: "linear-gradient(135deg,#c05e0c,#e1711c,#f59e0b)", padding: "36px 24px" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", gap: 20 }}>
                    <div style={{
                        width: 56, height: 56, borderRadius: 16,
                        background: "rgba(255,255,255,0.2)",
                        border: "2px solid rgba(255,255,255,0.3)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                    }}>
                        <Heart size={26} color="#fff" fill="rgba(255,255,255,0.6)" />
                    </div>
                    <div>
                        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#fff", lineHeight: 1.2 }}>
                            My Wishlist
                        </h1>
                        <p style={{ margin: "4px 0 0", fontSize: 13, color: "rgba(255,255,255,0.75)" }}>
                            {wishlist?.length
                                ? `${wishlist.length} book${wishlist.length > 1 ? "s" : ""} saved for later`
                                : "Books you love, saved for later"}
                        </p>
                    </div>

                    {/* Count badge */}
                    {!!wishlist?.length && (
                        <div style={{ marginLeft: "auto", background: "rgba(255,255,255,0.2)", border: "2px solid rgba(255,255,255,0.3)", borderRadius: 14, padding: "10px 20px", textAlign: "center" }}>
                            <p style={{ margin: 0, fontSize: 24, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{wishlist.length}</p>
                            <p style={{ margin: "3px 0 0", fontSize: 11, color: "rgba(255,255,255,0.75)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Books</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Body ───────────────────────────────────── */}
            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px 60px" }}>

                {!wishlist?.length ? (
                    /* ── Empty state ── */
                    <div style={{
                        display: "flex", flexDirection: "column", alignItems: "center",
                        justifyContent: "center", padding: "80px 24px",
                        background: "#fff", borderRadius: 20,
                        border: "1px solid #f0ede9",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                        textAlign: "center",
                    }}>
                        <div style={{ width: 80, height: 80, borderRadius: 24, background: "#fff7ed", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                            <Heart size={36} color="#fed7aa" />
                        </div>
                        <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#374151" }}>Your wishlist is empty!</p>
                        <p style={{ margin: "8px 0 28px", fontSize: 14, color: "#9ca3af" }}>
                            Save books you love and come back to them anytime.
                        </p>
                        <Link
                            href="/books"
                            style={{
                                display: "inline-flex", alignItems: "center", gap: 8,
                                padding: "12px 28px", borderRadius: 12,
                                background: "#f97316", color: "#fff",
                                fontWeight: 600, fontSize: 14, textDecoration: "none",
                                boxShadow: "0 2px 8px rgba(249,115,22,0.3)",
                            }}
                        >
                            <BookOpen size={16} /> Browse Books
                        </Link>
                    </div>
                ) : (
                    /* ── Book grid ── */
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-7">
                        {wishlist.map(book => {
                            const imageSrc = book.coverImage || book.thumbnail || book.images?.[0]?.url
                            return (
                                <div
                                    key={book._id}
                                    style={{
                                        background: "#fff",
                                        borderRadius: 18,
                                        border: "1px solid #f0ede9",
                                        overflow: "hidden",
                                        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                                        display: "flex",
                                        flexDirection: "column",
                                        transition: "box-shadow .2s, transform .2s",
                                    }}
                                    onMouseEnter={e => {
                                        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 28px rgba(0,0,0,0.1)"
                                        ;(e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"
                                    }}
                                    onMouseLeave={e => {
                                        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)"
                                        ;(e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"
                                    }}
                                >
                                    {/* ── Cover image ── */}
                                    <Link href={`/books/${book._id}`} style={{ textDecoration: "none", display: "block" }}>
                                        <div style={{ aspectRatio: "3/4", overflow: "hidden", background: "#f3f4f6", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            {imageSrc ? (
                                                <img
                                                    src={imageSrc}
                                                    alt={book.title}
                                                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .35s ease", display: "block", color: "transparent" }}
                                                    onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = "scale(1.06)" }}
                                                    onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = "scale(1)" }}
                                                    onError={e => {
                                                        // Replace broken image with a clean fallback
                                                        (e.target as HTMLImageElement).src = "https://placehold.co/400x600/f3f4f6/a3a3a3?text=No+Cover"
                                                    }}
                                                />
                                            ) : (
                                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, color: "#9ca3af" }}>
                                                    <ImageIcon size={32} />
                                                    <span style={{ fontSize: 12, fontWeight: 600 }}>No Cover</span>
                                                </div>
                                            )}
                                            {/* Heart badge */}
                                            <div style={{
                                                position: "absolute", top: 12, right: 12,
                                                width: 32, height: 32, borderRadius: 10,
                                                background: "rgba(255,255,255,0.95)",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                                            }}>
                                                <Heart size={16} color="#f97316" fill="#f97316" />
                                            </div>
                                        </div>
                                    </Link>

                                    {/* ── Info ── */}
                                    <div style={{ padding: "16px 16px 18px", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                                        <Link href={`/books/${book._id}`} style={{ textDecoration: "none" }}>
                                            <h3 style={{
                                                margin: 0, fontSize: 15, fontWeight: 700,
                                                color: "#111827", lineHeight: 1.4,
                                                display: "-webkit-box", WebkitLineClamp: 2,
                                                WebkitBoxOrient: "vertical", overflow: "hidden",
                                            }}>
                                                {book.title}
                                            </h3>
                                        </Link>

                                        <p style={{ margin: 0, fontSize: 13, color: "#9ca3af", fontWeight: 500 }}>
                                            {book.author}
                                        </p>

                                        <p style={{ margin: "4px 0 0", fontSize: 17, fontWeight: 800, color: "#f97316" }}>
                                            Rs. {book.price.toLocaleString()}
                                        </p>

                                        {/* ── Action buttons ── */}
                                        <div style={{ display: "flex", gap: 8, marginTop: "auto", paddingTop: 14 }}>
                                            <button
                                                onClick={() => handleAddToCart(book._id)}
                                                style={{
                                                    flex: 1, display: "flex", alignItems: "center",
                                                    justifyContent: "center", gap: 6,
                                                    padding: "10px 0", borderRadius: 10,
                                                    background: "#f97316", color: "#fff",
                                                    border: "none", fontSize: 13, fontWeight: 600,
                                                    cursor: "pointer",
                                                    boxShadow: "0 2px 6px rgba(249,115,22,0.25)",
                                                    transition: "background .15s",
                                                }}
                                                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#ea6c0a" }}
                                                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#f97316" }}
                                            >
                                                <ShoppingCart size={15} />
                                                Add to Cart
                                            </button>

                                            <button
                                                onClick={() => handleRemove(book._id)}
                                                style={{
                                                    width: 40, height: 40, borderRadius: 10,
                                                    background: "#fff", border: "1.5px solid #fecaca",
                                                    display: "flex", alignItems: "center", justifyContent: "center",
                                                    cursor: "pointer", color: "#f87171", flexShrink: 0,
                                                    transition: "background .15s, color .15s",
                                                }}
                                                onMouseEnter={e => {
                                                    (e.currentTarget as HTMLButtonElement).style.background = "#fee2e2"
                                                    ;(e.currentTarget as HTMLButtonElement).style.color = "#ef4444"
                                                }}
                                                onMouseLeave={e => {
                                                    (e.currentTarget as HTMLButtonElement).style.background = "#fff"
                                                    ;(e.currentTarget as HTMLButtonElement).style.color = "#f87171"
                                                }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Wishlist