"use client";
import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, MapPin, Loader2, Package, CreditCard, CheckCircle } from "lucide-react"
import PageSpinner from "../components/common/PageSpinner"
import { useOrderDetail, useOrders } from "../hooks/useOrders"
import { toastApiError } from "../lib/api-error"
import { toast } from "react-toastify";

const statusStyle: Record<string, React.CSSProperties> = {
    pending:    { background: "#fef9c3", color: "#854d0e", border: "1px solid #fde047" },
    confirmed:  { background: "#dbeafe", color: "#1e40af", border: "1px solid #93c5fd" },
    processing: { background: "#f3e8ff", color: "#7e22ce", border: "1px solid #d8b4fe" },
    shipped:    { background: "#e0e7ff", color: "#3730a3", border: "1px solid #a5b4fc" },
    delivered:  { background: "#dcfce7", color: "#166534", border: "1px solid #86efac" },
    cancelled:  { background: "#fee2e2", color: "#991b1b", border: "1px solid #fca5a5" },
}

const trackingSteps = [
    { step: "pending",    label: "Order Placed"  },
    { step: "confirmed",  label: "Confirmed"     },
    { step: "processing", label: "Processing"    },
    { step: "shipped",    label: "Shipped"       },
    { step: "delivered",  label: "Delivered"     },
]

const card: React.CSSProperties = {
    background: "#fff",
    borderRadius: 18,
    border: "1px solid #f0ede9",
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
    padding: "28px 28px",
}

const cardTitle: React.CSSProperties = {
    margin: "0 0 20px",
    fontSize: 15,
    fontWeight: 700,
    color: "#111827",
    display: "flex",
    alignItems: "center",
    gap: 10,
    paddingBottom: 16,
    borderBottom: "1px solid #f3f4f6",
}

const iconBox = (bg: string): React.CSSProperties => ({
    width: 32, height: 32, borderRadius: 10,
    background: bg, display: "flex",
    alignItems: "center", justifyContent: "center", flexShrink: 0,
})

const OrderDetail = () => {
    const params = useParams()
    const id = params?.id as string | undefined
    const { cancelOrder } = useOrders()
    const [cancelling, setCancelling] = useState(false)
    const { data: order, isLoading } = useOrderDetail(id)

    const handleCancel = async () => {
        if (!confirm("Are you sure you want to cancel this order?")) return
        try {
            setCancelling(true)
            await cancelOrder(id!, { cancelReason: "Cancelled by user" })
            toast.success("Order cancelled!")
        } catch (error: unknown) {
            toastApiError(error, "Failed to cancel order")
        } finally {
            setCancelling(false)
        }
    }

    const currentStepIndex = trackingSteps.findIndex(s => s.step === order?.orderStatus)

    if (isLoading) return <PageSpinner />
    if (!order) return (
        <div style={{ minHeight: "calc(100vh - 64px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f3f4f6" }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#111827", marginBottom: 10 }}>Order Not Found</h2>
            <p style={{ color: "#6b7280", marginBottom: 20 }}>We couldn't find the order you're looking for.</p>
            <Link href="/orders" style={{ background: "#f97316", color: "#fff", padding: "10px 20px", borderRadius: 8, textDecoration: "none", fontWeight: 600 }}>
                Go to My Orders
            </Link>
        </div>
    )

    return (
        <div style={{ minHeight: "calc(100vh - 64px)", width: "100%", background: "#F5F3EF" }}>

            {/* ── Banner ─────────────────────────────────── */}
            <div style={{ background: "linear-gradient(135deg,#c05e0c,#e1711c,#f59e0b)", padding: "28px 24px" }}>
                <div style={{ maxWidth: 1000, margin: "0 auto" }}>
                    {/* Back link */}
                    <Link
                        href="/orders"
                        style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: 600, textDecoration: "none", marginBottom: 16 }}
                    >
                        <ArrowLeft size={15} /> Back to Orders
                    </Link>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                        <div>
                            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#fff" }}>
                                Order #{order.orderNumber}
                            </h1>
                            <p style={{ margin: "5px 0 0", fontSize: 13, color: "rgba(255,255,255,0.75)" }}>
                                Placed on {new Date(order.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" })}
                            </p>
                        </div>
                        <span style={{
                            ...(statusStyle[order.orderStatus] || {}),
                            fontSize: 12, fontWeight: 700, padding: "6px 16px",
                            borderRadius: 999, textTransform: "capitalize",
                        }}>
                            {order.orderStatus}
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Body ───────────────────────────────────── */}
            <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px 60px", display: "flex", flexDirection: "column", gap: 20 }}>

                {/* ── Tracking stepper ─────────────────── */}
                {order.orderStatus !== "cancelled" && (
                    <div style={card}>
                        <p style={cardTitle}>
                            <span style={iconBox("#fff7ed")}><Package size={16} color="#f97316" /></span>
                            Order Tracking
                        </p>
                        <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "8px 0" }}>
                            {/* Background line */}
                            <div style={{ position: "absolute", top: 20, left: 0, right: 0, height: 3, background: "#f3f4f6", borderRadius: 99, zIndex: 0 }} />
                            {/* Progress line */}
                            <div style={{
                                position: "absolute", top: 20, left: 0, height: 3,
                                background: "linear-gradient(90deg,#c05e0c,#f97316)",
                                borderRadius: 99, zIndex: 1, transition: "width .5s ease",
                                width: currentStepIndex < 0 ? "0%" : `${(currentStepIndex / (trackingSteps.length - 1)) * 100}%`,
                            }} />

                            {trackingSteps.map((step, i) => {
                                const done = i <= currentStepIndex
                                return (
                                    <div key={step.step} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, zIndex: 2, flex: 1 }}>
                                        <div style={{
                                            width: 40, height: 40, borderRadius: "50%",
                                            background: done ? "linear-gradient(135deg,#e1711c,#f97316)" : "#f3f4f6",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            boxShadow: done ? "0 2px 8px rgba(249,115,22,0.35)" : "none",
                                            transition: "all .3s",
                                        }}>
                                            {done
                                                ? <CheckCircle size={18} color="#fff" />
                                                : <span style={{ fontSize: 13, fontWeight: 700, color: "#9ca3af" }}>{i + 1}</span>
                                            }
                                        </div>
                                        <p style={{ margin: 0, fontSize: 11, fontWeight: done ? 700 : 500, color: done ? "#e1711c" : "#9ca3af", textAlign: "center", maxWidth: 72 }}>
                                            {step.label}
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* ── Order Items ───────────────────────── */}
                <div style={card}>
                    <p style={cardTitle}>
                        <span style={iconBox("#fff7ed")}><Package size={16} color="#f97316" /></span>
                        Order Items ({order.items.length})
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                        {order.items.map((item, i) => (
                            <div key={i} style={{
                                display: "flex", alignItems: "center", gap: 16,
                                padding: "16px 0",
                                borderBottom: i < order.items.length - 1 ? "1px solid #f9fafb" : "none",
                            }}>
                                <div style={{ width: 56, height: 72, borderRadius: 10, overflow: "hidden", background: "#f3f4f6", flexShrink: 0, border: "1px solid #f0ede9" }}>
                                    <img
                                        src={item.coverImage}
                                        alt={item.title}
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        onError={e => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/56x72?text=📖" }}
                                    />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {item.title}
                                    </p>
                                    <p style={{ margin: "5px 0 0", fontSize: 12, color: "#9ca3af" }}>
                                        Qty: <strong style={{ color: "#374151" }}>{item.quantity}</strong>
                                        &nbsp;·&nbsp; Rs. {item.price.toLocaleString()} each
                                    </p>
                                </div>
                                <p style={{ margin: 0, fontWeight: 800, fontSize: 15, color: "#111827", flexShrink: 0 }}>
                                    Rs. {(item.price * item.quantity).toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Delivery + Payment ─────────────────── */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

                    {/* Delivery Address */}
                    <div style={card}>
                        <p style={cardTitle}>
                            <span style={iconBox("#fff7ed")}><MapPin size={16} color="#f97316" /></span>
                            Delivery Address
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#111827" }}>
                                {order.shippingAddress.fullName}
                            </p>
                            <p style={{ margin: 0, fontSize: 13, color: "#6b7280" }}>{order.shippingAddress.street}</p>
                            <p style={{ margin: 0, fontSize: 13, color: "#6b7280" }}>
                                {order.shippingAddress.city}, {order.shippingAddress.province}
                            </p>
                            <p style={{ margin: 0, fontSize: 13, color: "#6b7280" }}>{order.shippingAddress.country}</p>
                            <p style={{ margin: "6px 0 0", fontSize: 13, fontWeight: 600, color: "#f97316" }}>
                                {order.shippingAddress.phone}
                            </p>
                        </div>
                    </div>

                    {/* Payment Summary */}
                    <div style={card}>
                        <p style={cardTitle}>
                            <span style={iconBox("#f0fdf4")}><CreditCard size={16} color="#16a34a" /></span>
                            Payment Summary
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                                <span style={{ color: "#9ca3af" }}>Subtotal</span>
                                <span style={{ fontWeight: 600, color: "#374151" }}>Rs. {order.totalAmount.toLocaleString()}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                                <span style={{ color: "#9ca3af" }}>Delivery</span>
                                <span style={{ fontWeight: 600, color: order.deliveryCharges === 0 ? "#16a34a" : "#374151" }}>
                                    {order.deliveryCharges === 0 ? "FREE" : `Rs. ${order.deliveryCharges}`}
                                </span>
                            </div>
                            {order.discount > 0 && (
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                                    <span style={{ color: "#9ca3af" }}>Discount</span>
                                    <span style={{ fontWeight: 600, color: "#16a34a" }}>− Rs. {order.discount.toLocaleString()}</span>
                                </div>
                            )}
                            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid #f3f4f6", marginTop: 2 }}>
                                <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Total</span>
                                <span style={{ fontSize: 16, fontWeight: 800, color: "#f97316" }}>Rs. {order.finalAmount.toLocaleString()}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                                <span style={{ color: "#9ca3af" }}>Payment</span>
                                <span style={{ fontWeight: 700, color: "#374151", textTransform: "uppercase", fontSize: 12 }}>{order.paymentMethod}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                                <span style={{ color: "#9ca3af" }}>Status</span>
                                <span style={{ fontWeight: 700, color: order.paymentStatus === "paid" ? "#16a34a" : "#d97706", textTransform: "capitalize" }}>
                                    {order.paymentStatus}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Cancel Button ──────────────────────── */}
                {["pending", "confirmed"].includes(order.orderStatus) && (
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <button
                            onClick={handleCancel}
                            disabled={cancelling}
                            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 28px", borderRadius: 12, border: "2px solid #fca5a5", background: "#fff", color: "#ef4444", fontWeight: 600, fontSize: 14, cursor: cancelling ? "not-allowed" : "pointer", opacity: cancelling ? 0.65 : 1, transition: "all .2s" }}
                        >
                            {cancelling && <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />}
                            {cancelling ? "Cancelling..." : "Cancel Order"}
                        </button>
                    </div>
                )}

                {/* ── Cancel Reason ──────────────────────── */}
                {order.orderStatus === "cancelled" && order.cancelReason && (
                    <div style={{ background: "#fff5f5", borderRadius: 14, border: "1px solid #fecaca", padding: "18px 22px" }}>
                        <p style={{ margin: 0, fontSize: 13, color: "#ef4444" }}>
                            <strong>Cancel Reason: </strong>{order.cancelReason}
                        </p>
                    </div>
                )}

            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    )
}

export default OrderDetail