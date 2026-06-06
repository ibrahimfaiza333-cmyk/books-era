"use client";
import { useState } from "react"
import Link from "next/link"
import { Package, ChevronRight, ShoppingBag } from "lucide-react"
import PageSpinner from "../components/common/PageSpinner"
import { useOrdersList } from "../hooks/useOrders"
import type { Order } from "../types"

const statusStyle: Record<string, React.CSSProperties> = {
    pending:    { background: "#fef9c3", color: "#854d0e", border: "1px solid #fde047" },
    confirmed:  { background: "#dbeafe", color: "#1e40af", border: "1px solid #93c5fd" },
    processing: { background: "#f3e8ff", color: "#7e22ce", border: "1px solid #d8b4fe" },
    shipped:    { background: "#e0e7ff", color: "#3730a3", border: "1px solid #a5b4fc" },
    delivered:  { background: "#dcfce7", color: "#166534", border: "1px solid #86efac" },
    cancelled:  { background: "#fee2e2", color: "#991b1b", border: "1px solid #fca5a5" },
}

const Orders = () => {
    const [page, setPage] = useState(1)
    const { data, isLoading } = useOrdersList(page)
    const orders: Order[] = data?.orders    || []
    const totalPages      = data?.totalPages || 1

    if (isLoading) return <PageSpinner />

    return (
        <div style={{ minHeight: "calc(100vh - 64px)", width: "100%", background: "#F5F3EF" }}>

            {/* ── Banner ─────────────────────────────────── */}
            <div style={{ background: "linear-gradient(135deg,#c05e0c,#e1711c,#f59e0b)", padding: "36px 24px" }}>
                <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", alignItems: "center", gap: 20 }}>
                    <div style={{
                        width: 56, height: 56, borderRadius: 16,
                        background: "rgba(255,255,255,0.2)",
                        border: "2px solid rgba(255,255,255,0.3)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                    }}>
                        <ShoppingBag size={26} color="#fff" />
                    </div>
                    <div>
                        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#fff", lineHeight: 1.2 }}>
                            My Orders
                        </h1>
                        <p style={{ margin: "4px 0 0", fontSize: 13, color: "rgba(255,255,255,0.75)" }}>
                            Track and manage all your purchases
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Body ───────────────────────────────────── */}
            <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px 60px" }}>

                {orders.length === 0 ? (
                    /* ── Empty state ── */
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px", background: "#fff", borderRadius: 20, border: "1px solid #f0ede9", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                        <div style={{ width: 80, height: 80, borderRadius: 24, background: "#fff7ed", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                            <Package size={36} color="#fed7aa" />
                        </div>
                        <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#374151" }}>No orders yet!</p>
                        <p style={{ margin: "8px 0 24px", fontSize: 14, color: "#9ca3af" }}>Looks like you haven&apos;t placed any orders.</p>
                        <Link
                            href="/books"
                            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 28px", borderRadius: 12, background: "#f97316", color: "#fff", fontWeight: 600, fontSize: 14, textDecoration: "none", boxShadow: "0 2px 8px rgba(249,115,22,0.3)" }}
                        >
                            <ShoppingBag size={16} /> Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        {orders.map(order => (
                            <Link
                                key={order._id}
                                href={`/orders/${order._id}`}
                                style={{ textDecoration: "none", display: "block" }}
                            >
                                <div style={{
                                    background: "#fff", borderRadius: 18,
                                    border: "1px solid #f0ede9",
                                    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                                    padding: "20px 24px",
                                    transition: "box-shadow .2s, transform .2s",
                                    cursor: "pointer",
                                }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 6px 24px rgba(0,0,0,0.1)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-1px)" }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)" }}
                                >
                                    {/* Top row */}
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                                            <div style={{ width: 42, height: 42, borderRadius: 12, background: "#fff7ed", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                <Package size={20} color="#f97316" />
                                            </div>
                                            <div>
                                                <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: "#111827" }}>
                                                    Order #{order.orderNumber}
                                                </p>
                                                <p style={{ margin: "3px 0 0", fontSize: 12, color: "#9ca3af" }}>
                                                    {new Date(order.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" })}
                                                </p>
                                            </div>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                            <span style={{
                                                ...(statusStyle[order.orderStatus] || {}),
                                                fontSize: 11, fontWeight: 700, padding: "4px 12px",
                                                borderRadius: 999, textTransform: "capitalize",
                                            }}>
                                                {order.orderStatus}
                                            </span>
                                            <ChevronRight size={18} color="#d1d5db" />
                                        </div>
                                    </div>

                                    {/* Book covers */}
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                                        {order.items.slice(0, 4).map((item, i) => (
                                            <div key={i} style={{ width: 44, height: 58, borderRadius: 8, overflow: "hidden", background: "#f3f4f6", flexShrink: 0, border: "1px solid #f0ede9" }}>
                                                <img
                                                    src={item.coverImage}
                                                    alt={item.title}
                                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                    onError={e => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/44x58?text=📖" }}
                                                />
                                            </div>
                                        ))}
                                        {order.items.length > 4 && (
                                            <div style={{ width: 44, height: 58, borderRadius: 8, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#6b7280", flexShrink: 0 }}>
                                                +{order.items.length - 4}
                                            </div>
                                        )}
                                    </div>

                                    {/* Bottom row */}
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 14, borderTop: "1px solid #f9fafb" }}>
                                        <span style={{ fontSize: 13, color: "#9ca3af", fontWeight: 500 }}>
                                            {order.items.length} item{order.items.length > 1 ? "s" : ""}
                                        </span>
                                        <span style={{ fontSize: 16, fontWeight: 800, color: "#f97316" }}>
                                            Rs. {order.finalAmount.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 8 }}>
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    style={{ padding: "10px 22px", borderRadius: 12, border: "1.5px solid #e5e7eb", background: "#fff", fontSize: 13, fontWeight: 600, color: "#374151", cursor: "pointer", opacity: page === 1 ? 0.45 : 1 }}
                                >
                                    ← Previous
                                </button>
                                <div style={{ display: "flex", alignItems: "center", padding: "0 16px", borderRadius: 12, border: "1.5px solid #e5e7eb", background: "#fff", fontSize: 13, fontWeight: 600, color: "#6b7280" }}>
                                    {page} / {totalPages}
                                </div>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    style={{ padding: "10px 22px", borderRadius: 12, border: "1.5px solid #e5e7eb", background: "#fff", fontSize: 13, fontWeight: 600, color: "#374151", cursor: "pointer", opacity: page === totalPages ? 0.45 : 1 }}
                                >
                                    Next →
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Orders