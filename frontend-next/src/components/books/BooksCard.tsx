"use client";
import Link from "next/link";
import { Heart, ShoppingCart, Image as ImageIcon } from "lucide-react"
import type { Book } from "../../types"
import { useCart } from "../../hooks/useCart"
import { useWishlist } from "../../hooks/useWishlist"
import { getDiscountPercent } from "../../lib/book"
import { toastApiError } from "../../lib/api-error"
import { toast } from "react-toastify";
import { useAppSelector } from "../../store/hooks"

interface Props {
    book: Book
}

const BookCard = ({ book }: Props) => {
    const { isLoggedIn } = useAppSelector(state => state.auth)
    const { addToCart }     = useCart()
    const { addToWishlist } = useWishlist()

    const currentPrice = book.discountPrice > 0 ? book.discountPrice : book.price
    const discountPercent = getDiscountPercent(book.price, currentPrice)

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault()
        if (!isLoggedIn) {
            toast.error("Please login first!")
            return
        }
        try {
            await addToCart({ bookId: book._id, quantity: 1 })
            toast.success("Added to cart!")
        } catch (error: unknown) {
            toastApiError(error, "Failed!")
        }
    }

    const handleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault()
        if (!isLoggedIn) {
            toast.error("Please login first!")
            return
        }
        try {
            await addToWishlist(book._id)
            toast.success("Added to wishlist!")
        } catch (error: unknown) {
            toastApiError(error, "Failed!")
        }
    }

    const rawImages = [book.coverImage, book.thumbnail, ...(book.images?.map(i => i.url) || [])]
    const currentImage = rawImages.filter(Boolean)[0] || ""

    return (
        <Link
            href={`/books/${book._id}`}
            className="group block bg-white rounded-[20px] border border-[#f0ede9] overflow-hidden no-underline transition-all duration-200 hover:-translate-y-1.5 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
        >
            {/* ── Image Area ── */}
            <div className="relative w-full aspect-[3/4] bg-gray-50 flex items-center justify-center overflow-hidden">
                {currentImage ? (
                    <img
                        src={currentImage}
                        alt={book.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://placehold.co/300x400/f3f4f6/a3a3a3?text=No+Cover"
                        }}
                    />
                ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                        <ImageIcon size={32} />
                        <span className="text-xs font-semibold">No Cover</span>
                    </div>
                )}

                {/* Badges */}
                {discountPercent > 0 && (
                    <span style={{ padding: "3px 8px" }} className="absolute top-2 left-2 md:top-3 md:left-3 bg-red-500 text-white rounded-full text-[10px] md:text-xs font-extrabold tracking-wide shadow-[0_2px_8px_rgba(239,68,68,0.4)]">
                        {discountPercent}% OFF
                    </span>
                )}

                {/* Wishlist */}
                <button
                    onClick={handleWishlist}
                    className="absolute top-2 right-2 md:top-3 md:right-3 w-8 h-8 md:w-[34px] md:h-[34px] rounded-full bg-white flex items-center justify-center border-none cursor-pointer text-gray-400 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-colors hover:text-red-500"
                >
                    <Heart className="w-4 h-4 md:w-4 md:h-4" />
                </button>
            </div>

            {/* ── Details Area ── */}
            <div style={{ padding: "14px 12px", display: "flex", flexDirection: "column", gap: 10 }}>
                <div>
                    <h3 className="m-0 text-sm md:text-base font-bold text-gray-900 leading-snug line-clamp-2">
                        {book.title}
                    </h3>
                    <p className="m-0 mt-1 text-xs md:text-[13px] text-gray-500 truncate">
                        {book.author}
                    </p>
                </div>

                {/* Price & Action */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: 4 }}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <span className="text-[15px] md:text-[18px] font-extrabold text-orange-500 leading-none whitespace-nowrap">
                            Rs. {currentPrice.toLocaleString()}
                        </span>
                        {discountPercent > 0 && (
                            <span className="text-[11px] md:text-xs font-medium text-gray-400 line-through mt-1">
                                Rs. {book.price.toLocaleString()}
                            </span>
                        )}
                    </div>

                    <button
                        onClick={handleAddToCart}
                        style={{ display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginLeft: 6 }}
                        className="w-[34px] h-[34px] md:w-10 md:h-10 rounded-lg md:rounded-xl bg-orange-50 text-orange-500 border-none cursor-pointer transition-colors hover:bg-orange-500 hover:text-white"
                    >
                        <ShoppingCart className="w-[16px] h-[16px] md:w-[18px] md:h-[18px]" />
                    </button>
                </div>

                {/* Stock Warning */}
                {(book.stock <= 5 && book.stock > 0) ? (
                    <p className="m-0 text-[10px] md:text-xs font-semibold text-red-500">Only {book.stock} left!</p>
                ) : book.stock === 0 ? (
                    <p className="m-0 text-[10px] md:text-xs font-semibold text-red-500">Out of Stock</p>
                ) : null}
            </div>
        </Link>
    )
}

export default BookCard