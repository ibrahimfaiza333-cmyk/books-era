"use client";
import { useParams } from "next/navigation";
import { useState } from "react"
import Link from "next/link";
import {
    ShoppingCart, Heart, Star,
    Minus, Plus, ArrowLeft, Loader2, BookOpen, Image as ImageIcon
} from "lucide-react"
import { useBookDetail, useBookReviews } from "../hooks/useBooks"
import { useCart } from "../hooks/useCart"
import { useWishlist } from "../hooks/useWishlist"
import { getDiscountPercent } from "../lib/book"
import { toastApiError } from "../lib/api-error"
import { useAppSelector } from "../store/hooks"
import { toast } from "react-toastify";
import { useForm } from "react-hook-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addReview } from "../api/reviews.api"
import { queryKeys } from "../lib/query-keys"
import type{ Review } from "../types"

const BookDetail = () => {
    const params = useParams()
    const id = params?.id as string | undefined
    const { isLoggedIn } = useAppSelector(state => state.auth)
    const { addToCart }     = useCart()
    const { addToWishlist } = useWishlist()
    const [quantity,   setQuantity]   = useState(1)
    const [activeImg,  setActiveImg]  = useState(0)
    const [loading,    setLoading]    = useState(false)

    const { data: book, isLoading } = useBookDetail(id)
    const { data: reviewData } = useBookReviews(id)
    const reviews: Review[] = reviewData?.reviews || []
    
    const queryClient = useQueryClient()
    const { register, handleSubmit, reset, formState: { errors } } = useForm<{ rating: number, comment: string }>()
    const [reviewLoading, setReviewLoading] = useState(false)

    const reviewMutation = useMutation({
        mutationFn: (data: { rating: number, comment: string }) => addReview(id!, data),
        onSuccess: () => {
            toast.success("Review added!")
            queryClient.invalidateQueries({ queryKey: queryKeys.reviews(id) })
            reset()
        },
        onError: (err: any) => {
            toastApiError(err, "Failed to add review")
        },
        onSettled: () => setReviewLoading(false)
    })

    const onReviewSubmit = (data: { rating: number, comment: string }) => {
        setReviewLoading(true)
        reviewMutation.mutate(data)
    }

    const currentPrice = book ? (book.discountPrice > 0 ? book.discountPrice : book.price) : 0
    const discountPercent = book
        ? getDiscountPercent(book.price, currentPrice)
        : 0

    const handleAddToCart = async () => {
        if (!isLoggedIn) {
            toast.error("Please login first!")
            return
        }
        try {
            setLoading(true)
            await addToCart({ bookId: id!, quantity })
            toast.success("Added to cart!")
        } catch (error: unknown) {
            toastApiError(error, "Failed!")
        } finally {
            setLoading(false)
        }
    }

    const handleWishlist = async () => {
        if (!isLoggedIn) {
            toast.error("Please login first!")
            return
        }
        try {
            await addToWishlist(id!)
            toast.success("Added to wishlist!")
        } catch (error: unknown) {
            toastApiError(error, "Failed!")
        }
    }

    if (isLoading) {
        return (
            <div style={{ minHeight: "calc(100vh - 64px)", width: "100%", background: "#F5F3EF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Loader2 size={32} style={{ animation: "spin 1s linear infinite", color: "#f97316" }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        )
    }

    if (!book) {
        return (
            <div style={{ minHeight: "calc(100vh - 64px)", width: "100%", background: "#F5F3EF", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
                <div style={{ width: 80, height: 80, borderRadius: 24, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                    <BookOpen size={36} color="#d1d5db" />
                </div>
                <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#374151" }}>Book not found!</p>
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
                    Back to Books
                </Link>
            </div>
        )
    }

    // Include coverImage in the array of potential images
    const rawImages = [book.coverImage, book.thumbnail, ...(book.images?.map(i => i.url) || [])]
    const images = rawImages.filter(Boolean) as string[]
    if (images.length === 0) images.push("") // Fallback slot

    const currentImage = images[activeImg] || ""

    const cardStyle: React.CSSProperties = {
        background: "#fff", borderRadius: 20, border: "1px solid #f0ede9",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)", padding: 32
    }

    return (
        <div style={{ minHeight: "calc(100vh - 64px)", width: "100%", background: "#F5F3EF" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px 80px" }}>

                {/* ── Breadcrumb ── */}
                <Link
                    href="/books"
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#6b7280", fontSize: 13, fontWeight: 600, textDecoration: "none", marginBottom: 24 }}
                >
                    <ArrowLeft size={15} /> Back to Books
                </Link>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 32, alignItems: "start" }}>

                    {/* ── Left Column (Images) ── */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {/* Main Image */}
                        <div style={{
                            background: "#fff", borderRadius: 20, border: "1px solid #f0ede9",
                            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                            aspectRatio: "3/4", overflow: "hidden",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            position: "relative",
                            maxWidth: 380, width: "100%", margin: "0 auto"
                        }}>
                            {currentImage ? (
                                <img
                                    src={currentImage}
                                    alt={book.title}
                                    style={{ width: "100%", height: "100%", objectFit: "cover", color: "transparent" }}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "https://placehold.co/400x600/f3f4f6/a3a3a3?text=No+Cover"
                                    }}
                                />
                            ) : (
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, color: "#9ca3af" }}>
                                    <ImageIcon size={48} />
                                    <span style={{ fontSize: 14, fontWeight: 600 }}>No Cover</span>
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8 }}>
                                {images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImg(i)}
                                        style={{
                                            width: 72, height: 96, borderRadius: 12, overflow: "hidden",
                                            border: activeImg === i ? "2px solid #f97316" : "2px solid #fff",
                                            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                                            flexShrink: 0, padding: 0, cursor: "pointer",
                                            background: "#f3f4f6"
                                        }}
                                    >
                                        <img
                                            src={img}
                                            alt=""
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                            onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/400x600/f3f4f6/a3a3a3?text=No+Cover" }}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Right Column (Details) ── */}
                    <div style={{ ...cardStyle, display: "flex", flexDirection: "column", gap: 24 }}>

                        {/* Title & Category */}
                        <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                                <span style={{ background: "#fff7ed", color: "#f97316", padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                    {typeof book.category === "object" ? book.category.name : "Book"}
                                </span>
                                {book.isFeatured && (
                                    <span style={{ background: "#fef2f2", color: "#ef4444", padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Featured</span>
                                )}
                            </div>
                            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: "#111827", lineHeight: 1.3 }}>
                                {book.title}
                            </h1>
                            <p style={{ margin: "8px 0 0", fontSize: 15, color: "#6b7280" }}>
                                By <strong style={{ color: "#374151" }}>{book.author}</strong>
                                {book.publisher && ` | ${book.publisher}`}
                            </p>
                        </div>

                        {/* Rating */}
                        {book.ratingsCount > 0 && (
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div style={{ display: "flex", gap: 2 }}>
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <Star
                                            key={i}
                                            size={18}
                                            color={i <= Math.round(book.ratingsAverage) ? "#fbbf24" : "#e5e7eb"}
                                            fill={i <= Math.round(book.ratingsAverage) ? "#fbbf24" : "#e5e7eb"}
                                        />
                                    ))}
                                </div>
                                <span style={{ fontSize: 14, fontWeight: 600, color: "#6b7280" }}>
                                    {book.ratingsAverage} <span style={{ fontWeight: 400 }}>({book.ratingsCount} reviews)</span>
                                </span>
                            </div>
                        )}

                        {/* Price */}
                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                            <span style={{ fontSize: 32, fontWeight: 900, color: "#f97316" }}>
                                Rs. {currentPrice.toLocaleString()}
                            </span>
                            {discountPercent > 0 && (
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <span style={{ fontSize: 18, fontWeight: 500, color: "#9ca3af", textDecoration: "line-through" }}>
                                        Rs. {book.price.toLocaleString()}
                                    </span>
                                    <span style={{ background: "#fee2e2", color: "#ef4444", padding: "4px 10px", borderRadius: 8, fontSize: 13, fontWeight: 800 }}>
                                        {discountPercent}% OFF
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Metadata Grid */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, background: "#f9fafb", padding: 20, borderRadius: 16, border: "1px solid #f3f4f6" }}>
                            <div>
                                <p style={{ margin: 0, fontSize: 12, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase" }}>Language</p>
                                <p style={{ margin: "4px 0 0", fontSize: 14, fontWeight: 700, color: "#374151" }}>{book.language}</p>
                            </div>
                            {book.pages && (
                                <div>
                                    <p style={{ margin: 0, fontSize: 12, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase" }}>Pages</p>
                                    <p style={{ margin: "4px 0 0", fontSize: 14, fontWeight: 700, color: "#374151" }}>{book.pages}</p>
                                </div>
                            )}
                            {book.isbn && (
                                <div>
                                    <p style={{ margin: 0, fontSize: 12, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase" }}>ISBN</p>
                                    <p style={{ margin: "4px 0 0", fontSize: 14, fontWeight: 700, color: "#374151" }}>{book.isbn}</p>
                                </div>
                            )}
                            <div>
                                <p style={{ margin: 0, fontSize: 12, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase" }}>Availability</p>
                                <p style={{ margin: "4px 0 0", fontSize: 14, fontWeight: 800, color: book.stock > 0 ? "#16a34a" : "#ef4444" }}>
                                    {book.stock > 0 ? `${book.stock} in stock` : "Out of Stock"}
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 16, paddingTop: 8 }}>
                            {book.stock > 0 && (
                                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                    <span style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>Quantity:</span>
                                    <div style={{ display: "flex", alignItems: "center", background: "#f3f4f6", borderRadius: 12, padding: 4 }}>
                                        <button
                                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                            style={{ width: 36, height: 36, borderRadius: 8, background: "#fff", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span style={{ width: 48, textAlign: "center", fontSize: 15, fontWeight: 700, color: "#111827" }}>{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(q => Math.min(book.stock, q + 1))}
                                            style={{ width: 36, height: 36, borderRadius: 8, background: "#fff", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div style={{ display: "flex", gap: 12 }}>
                                <button
                                    onClick={handleAddToCart}
                                    disabled={loading || book.stock === 0}
                                    style={{
                                        flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                                        padding: "16px", borderRadius: 14, background: "#f97316", color: "#fff",
                                        border: "none", fontSize: 15, fontWeight: 700, cursor: (loading || book.stock === 0) ? "not-allowed" : "pointer",
                                        opacity: (loading || book.stock === 0) ? 0.65 : 1,
                                        boxShadow: "0 4px 14px rgba(249,115,22,0.25)", transition: "background .15s"
                                    }}
                                >
                                    {loading ? <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} /> : <ShoppingCart size={20} />}
                                    {book.stock === 0 ? "Out of Stock" : "Add to Cart"}
                                </button>
                                <button
                                    onClick={handleWishlist}
                                    style={{
                                        width: 54, height: 54, borderRadius: 14, background: "#fff", border: "2px solid #fecaca",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        cursor: "pointer", color: "#f87171", transition: "all .15s"
                                    }}
                                >
                                    <Heart size={22} />
                                </button>
                            </div>
                        </div>

                        {/* Description */}
                        {book.description && (
                            <div style={{ paddingTop: 24, borderTop: "1px solid #f3f4f6" }}>
                                <h3 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 700, color: "#111827" }}>About this book</h3>
                                <p style={{ margin: 0, fontSize: 14, color: "#4b5563", lineHeight: 1.7 }}>
                                    {book.description}
                                </p>
                            </div>
                        )}

                    </div>
                </div>

                {/* ── Reviews Section ── */}
                <div style={{ marginTop: 40 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#111827" }}>
                            Customer Reviews ({reviews.length})
                        </h2>
                    </div>

                    {isLoggedIn && (
                        <div style={{ ...cardStyle, padding: 24, marginBottom: 32 }}>
                            <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: "#374151" }}>Write a Review</h3>
                            <form onSubmit={handleSubmit(onReviewSubmit)} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    <label style={{ fontSize: 13, fontWeight: 600, color: "#4b5563" }}>Rating (1-5)</label>
                                    <input type="number" min="1" max="5" {...register("rating", { required: "Rating is required", min: 1, max: 5 })} style={{ width: 100, padding: "10px 14px", borderRadius: 10, border: "1px solid #d1d5db", outline: "none" }} />
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    <label style={{ fontSize: 13, fontWeight: 600, color: "#4b5563" }}>Comment (Optional)</label>
                                    <textarea {...register("comment")} rows={3} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #d1d5db", outline: "none", resize: "none" }} />
                                </div>
                                <div>
                                    <button type="submit" disabled={reviewLoading} style={{ padding: "12px 24px", borderRadius: 10, background: "#f97316", color: "#fff", border: "none", fontWeight: 700, cursor: reviewLoading ? "not-allowed" : "pointer", opacity: reviewLoading ? 0.7 : 1 }}>
                                        {reviewLoading ? "Submitting..." : "Submit Review"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {reviews.length > 0 ? (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
                            {reviews.map(review => (
                                <div key={review._id} style={{ ...cardStyle, padding: 24 }}>
                                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#fff7ed", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: "#f97316" }}>
                                                {review.user?.fullName?.charAt(0) || "U"}
                                            </div>
                                            <div>
                                                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#111827" }}>
                                                    {review.user?.fullName || "User"}
                                                </p>
                                                <div style={{ display: "flex", gap: 2, marginTop: 4 }}>
                                                    {[1, 2, 3, 4, 5].map(i => (
                                                        <Star
                                                            key={i} size={12}
                                                            color={i <= review.rating ? "#fbbf24" : "#e5e7eb"}
                                                            fill={i <= review.rating ? "#fbbf24" : "#e5e7eb"}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        {review.isVerifiedPurchase && (
                                            <span style={{ background: "#f0fdf4", color: "#16a34a", padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>
                                                Verified
                                            </span>
                                        )}
                                    </div>
                                    {review.comment && (
                                        <p style={{ margin: 0, fontSize: 14, color: "#4b5563", lineHeight: 1.6 }}>
                                            {review.comment}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: "center", padding: 40, background: "#fff", borderRadius: 20, border: "1px solid #f0ede9" }}>
                            <p style={{ color: "#6b7280", margin: 0 }}>No reviews yet. Be the first to review this book!</p>
                        </div>
                    )}
                </div>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    )
}

export default BookDetail