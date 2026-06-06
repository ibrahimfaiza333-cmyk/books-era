"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Truck } from "lucide-react"
import PageSpinner from "../components/common/PageSpinner"
import { useCart } from "../hooks/useCart"
import { toastApiError } from "../lib/api-error"
import { toast } from "react-toastify";

const Cart = () => {
    const navigate = useRouter()
    const {
        cart,
        isLoading,
        updateQuantity,
        removeItem,
        clearCart,
    } = useCart()


    const handleQuantity = async (bookId: string, quantity: number) => {
        try {
            await updateQuantity(bookId, quantity)
        } catch (error: unknown) {
            toastApiError(error, "Failed to update quantity")
        }
    }

    const handleRemove = async (bookId: string) => {
        try {
            await removeItem(bookId)
            toast.success("Item removed!")
        } catch (error: unknown) {
            toastApiError(error, "Failed to remove item")
        }
    }

    const handleClear = async () => {
        try {
            await clearCart()
            toast.success("Cart cleared!")
        } catch {
            toast.error("Failed!")
        }
    }

    if (isLoading) return <PageSpinner />

    const items = cart?.items || []

    return (
        <main style={{
            minHeight: "100vh",
            background: "#f3f4f6", // matching landing page background
            position: "relative",
            overflow: "hidden",
            paddingBottom: "100px"
        }}>
            {/* Decorative Background Blobs */}
            <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(251,191,36,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", top: 300, left: -80, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />

            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px", position: "relative" }}>
                
                {/* Header */}
                <div style={{ marginBottom: 40 }}>
                    <div style={{
                        display: "inline-flex", alignItems: "center", gap: 7,
                        background: "linear-gradient(135deg, #fff7ed, #ffedd5)",
                        color: "#f97316", padding: "7px 16px",
                        borderRadius: 999, fontSize: 12, fontWeight: 700,
                        textTransform: "uppercase", letterSpacing: "0.07em",
                        marginBottom: 14, border: "1px solid #fed7aa",
                        boxShadow: "0 2px 10px rgba(249,115,22,0.15)"
                    }}>
                        <ShoppingBag size={13} /> Your Shopping Cart
                    </div>

                    <h1 style={{
                        margin: 0, fontSize: "clamp(28px, 4vw, 42px)",
                        fontWeight: 800, color: "#111827", lineHeight: 1.15,
                        letterSpacing: "-0.5px"
                    }}>
                        Review Your{" "}
                        <span style={{
                            background: "linear-gradient(135deg, #f97316, #fb923c)",
                            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                            backgroundClip: "text"
                        }}>
                            Items
                        </span>
                    </h1>
                    <p style={{ margin: "10px 0 0", fontSize: 15, color: "#6b7280", fontWeight: 500 }}>
                        You have {items.length} item{items.length !== 1 && "s"} in your cart
                    </p>
                </div>

                {items.length === 0 ? (
                    /* Empty Cart State */
                    <div style={{
                        background: "#fff", borderRadius: 24, border: "1px dashed #d1d5db",
                        padding: "80px 20px", display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center", textAlign: "center",
                        boxShadow: "0 10px 40px rgba(0,0,0,0.03)", maxWidth: 700, margin: "0 auto"
                    }}>
                        <div style={{ background: "#fef3c7", padding: 24, borderRadius: "50%", marginBottom: 24, color: "#f59e0b" }}>
                            <ShoppingBag size={48} />
                        </div>
                        <h3 style={{ margin: "0 0 10px", fontSize: 24, fontWeight: 700, color: "#111827" }}>Your cart is empty</h3>
                        <p style={{ margin: "0 0 32px", color: "#6b7280", maxWidth: 400, lineHeight: 1.6 }}>
                            Looks like you haven't added any books to your cart yet. Explore our collection and find your next great read!
                        </p>
                        <Link
                            href="/books"
                            style={{
                                background: "linear-gradient(135deg, #f97316, #fb923c)", color: "#fff",
                                textDecoration: "none", padding: "14px 32px", borderRadius: 14,
                                fontSize: 16, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 8,
                                boxShadow: "0 4px 14px rgba(249,115,22,0.3)", transition: "transform .2s ease"
                            }}
                            className="hover:scale-105 active:scale-95"
                        >
                            Browse Books <ArrowRight size={18} />
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 32 }} className="lg:grid-cols-3">
                        
                        {/* Cart Items List */}
                        <div className="lg:col-span-2 flex flex-col gap-5">
                            {/* Clear All Header */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 8px" }}>
                                <span style={{ fontWeight: 600, color: "#374151" }}>Items ({items.length})</span>
                                <button
                                    onClick={handleClear}
                                    style={{
                                        background: "transparent", border: "none", color: "#ef4444",
                                        fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
                                        transition: "color .2s"
                                    }}
                                    className="hover:text-red-600"
                                >
                                    <Trash2 size={16} /> Clear All
                                </button>
                            </div>

                            {items.map(item => (
                                <div
                                    key={item.book._id}
                                    style={{
                                        background: "#fff", borderRadius: 20, padding: 20,
                                        border: "1px solid #e5e7eb", boxShadow: "0 4px 15px rgba(0,0,0,0.02)",
                                        display: "flex", gap: 20, alignItems: "flex-start", position: "relative"
                                    }}
                                >
                                    {/* Book Image */}
                                    <Link href={`/books/${item.book._id}`} style={{ flexShrink: 0 }}>
                                        <img
                                            src={item.book.coverImage || item.book.thumbnail}
                                            alt={item.book.title}
                                            style={{
                                                width: '70px',
                                                height: '95px',
                                                objectFit: 'cover',
                                                borderRadius: '6px',
                                                boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                                            }}
                                            onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/100x140?text=Book" }}
                                        />
                                    </Link>

                                    {/* Details */}
                                    <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
                                        <div>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                                                <Link
                                                    href={`/books/${item.book._id}`}
                                                    style={{ textDecoration: "none", color: "#111827", fontWeight: 700, fontSize: 18, lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
                                                    className="hover:text-orange-500 transition-colors"
                                                >
                                                    {item.book.title}
                                                </Link>
                                                {/* Price block (Desktop) */}
                                                <div style={{ textAlign: "right", flexShrink: 0 }} className="hidden sm:block">
                                                    <p style={{ margin: 0, color: "#f97316", fontWeight: 800, fontSize: 18 }}>
                                                        Rs. {(item.price * item.quantity).toLocaleString()}
                                                    </p>
                                                    <p style={{ margin: 0, fontSize: 12, color: "#9ca3af", marginTop: 2 }}>
                                                        Rs. {item.price.toLocaleString()} each
                                                    </p>
                                                </div>
                                            </div>
                                            <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: 14 }}>
                                                {item.book.author}
                                            </p>
                                        </div>

                                        {/* Price block (Mobile) */}
                                        <div className="block sm:hidden mt-3 mb-2">
                                            <p style={{ margin: 0, color: "#f97316", fontWeight: 800, fontSize: 18 }}>
                                                Rs. {(item.price * item.quantity).toLocaleString()}
                                            </p>
                                            <p style={{ margin: 0, fontSize: 12, color: "#9ca3af" }}>
                                                Rs. {item.price.toLocaleString()} each
                                            </p>
                                        </div>

                                        {/* Controls */}
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: 16 }}>
                                            
                                            {/* Quantity Selector */}
                                            <div style={{
                                                display: "inline-flex", alignItems: "center", background: "#f9fafb",
                                                border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden"
                                            }}>
                                                <button
                                                    onClick={() => handleQuantity(item.book._id, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                    style={{
                                                        background: "transparent", border: "none", padding: "8px 12px",
                                                        color: "#4b5563", cursor: item.quantity <= 1 ? "not-allowed" : "pointer",
                                                        opacity: item.quantity <= 1 ? 0.5 : 1, transition: "background .2s"
                                                    }}
                                                    className="hover:bg-gray-100"
                                                >
                                                    <Minus size={16} />
                                                </button>
                                                <span style={{ padding: "0 12px", fontWeight: 700, fontSize: 15, color: "#111827", minWidth: 40, textAlign: "center" }}>
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => handleQuantity(item.book._id, item.quantity + 1)}
                                                    disabled={item.quantity >= item.book.stock}
                                                    style={{
                                                        background: "transparent", border: "none", padding: "8px 12px",
                                                        color: "#4b5563", cursor: item.quantity >= item.book.stock ? "not-allowed" : "pointer",
                                                        opacity: item.quantity >= item.book.stock ? 0.5 : 1, transition: "background .2s"
                                                    }}
                                                    className="hover:bg-gray-100"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>

                                            {/* Remove Item */}
                                            <button
                                                onClick={() => handleRemove(item.book._id)}
                                                style={{
                                                    background: "#fef2f2", color: "#ef4444", border: "none",
                                                    width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                                                    cursor: "pointer", transition: "all .2s ease"
                                                }}
                                                className="hover:bg-red-500 hover:text-white"
                                                title="Remove Item"
                                            >
                                                <Trash2 size={18} />
                                            </button>

                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:col-span-1">
                            <div style={{
                                background: "#fff", borderRadius: 24, border: "1px solid #e5e7eb",
                                padding: 30, boxShadow: "0 10px 40px rgba(0,0,0,0.04)",
                                position: "sticky", top: 100
                            }}>
                                <h2 style={{ margin: "0 0 24px", fontSize: 20, fontWeight: 800, color: "#111827" }}>
                                    Order Summary
                                </h2>

                                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", color: "#4b5563", fontSize: 15 }}>
                                        <span>Subtotal ({items.length} items)</span>
                                        <span style={{ fontWeight: 600, color: "#111827" }}>
                                            Rs. {cart?.totalAmount?.toLocaleString()}
                                        </span>
                                    </div>
                                    
                                    <div style={{ display: "flex", justifyContent: "space-between", color: "#4b5563", fontSize: 15 }}>
                                        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                            Delivery
                                        </span>
                                        <span style={{ fontWeight: 700, color: cart?.isFreeDelivery ? "#10b981" : "#111827" }}>
                                            {cart?.isFreeDelivery ? "FREE" : `Rs. ${cart?.deliveryCharges}`}
                                        </span>
                                    </div>


                                    {/* Progress to Free Delivery */}
                                    {!cart?.isFreeDelivery && (
                                        <div style={{ background: "#fff7ed", padding: 12, borderRadius: 12, marginTop: 4 }}>
                                            <p style={{ margin: 0, fontSize: 13, color: "#c2410c", fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
                                                <Truck size={14} /> Add Rs. {((cart?.freeDeliveryOn || 3000) - (cart?.totalAmount || 0)).toLocaleString()} more for free delivery!
                                            </p>
                                        </div>
                                    )}

                                    <div style={{ width: "100%", height: 1, background: "#e5e7eb", margin: "8px 0" }} />

                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <span style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>Total</span>
                                        <span style={{ fontSize: 24, fontWeight: 800, color: "#f97316" }}>
                                            Rs. {cart?.finalAmount?.toLocaleString()}
                                        </span>
                                    </div>
                                </div>


                                <button
                                    onClick={() => navigate.push("/checkout")}
                                    style={{
                                        width: "100%", marginTop: 24, padding: "16px", borderRadius: 14,
                                        background: "linear-gradient(135deg, #f97316, #fb923c)", color: "#fff",
                                        border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer",
                                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                                        boxShadow: "0 6px 20px rgba(249,115,22,0.3)", transition: "transform .2s ease"
                                    }}
                                    className="hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Proceed to Checkout <ArrowRight size={18} />
                                </button>

                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 20, color: "#6b7280", fontSize: 13 }}>
                                    <ShieldCheck size={16} className="text-green-500" /> Secure Checkout
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </main>
    )
}

export default Cart