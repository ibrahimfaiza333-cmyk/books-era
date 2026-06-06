"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { MapPin, Loader2, CreditCard, ArrowRight, CheckCircle2, ShieldCheck, Tag } from "lucide-react"
import { useCart } from "../hooks/useCart"
import { useOrders } from "../hooks/useOrders"
import { toastApiError } from "../lib/api-error"
import { useAppSelector } from "../store/hooks"
import { toast } from "react-toastify";
import type{ Address } from "../types"

interface CheckoutForm {
    note:        string
    couponCode:  string
}

const Checkout = () => {
    const navigate = useRouter()
    const searchParams = useSearchParams()
    const { user } = useAppSelector(state => state.auth)
    const { cart, clearCart } = useCart()
    const { validateCoupon, createOrder } = useOrders()
    const [selectedAddress, setSelectedAddress] = useState<string>("")
    const [loading,         setLoading]         = useState(false)
    const [discount,        setDiscount]        = useState(0)
    const [couponApplied,   setCouponApplied]   = useState(false)

    const { register, handleSubmit, watch, setValue } = useForm<CheckoutForm>()
    const couponCode = watch("couponCode")

    // Auto-apply coupon from Cart URL param
    useEffect(() => {
        const code = searchParams?.get("coupon")
        if (code) {
            setValue("couponCode", code)
        }
    }, [searchParams, setValue])

    // Addresses from user
    const addresses: Address[] = user?.addresses || []

    // Set default address
    useState(() => {
        const def = addresses.find(a => a.isDefault)
        if (def) setSelectedAddress(def._id)
    })

    const handleApplyCoupon = async () => {
        if (!couponCode?.trim()) return
        try {
            const result = await validateCoupon({
                code: couponCode,
                orderAmount: cart?.totalAmount,
            })
            setDiscount(result.discount)
            setCouponApplied(true)
            toast.success("Coupon applied!")
        } catch (error: unknown) {
            toastApiError(error, "Invalid coupon!")
        }
    }

    const onSubmit = async (data: CheckoutForm) => {
        if (!selectedAddress) {
            toast.error("Please select a delivery address!")
            return
        }

        const address = addresses.find(a => a._id === selectedAddress)
        if (!address) return

        try {
            setLoading(true)
            const order = await createOrder({
                shippingAddress: {
                    fullName:   address.fullName,
                    phone:      address.phone,
                    street:     address.street,
                    city:       address.city,
                    province:   address.province,
                    postalCode: address.postalCode,
                    country:    address.country,
                },
                paymentMethod: "cod",
                couponCode:    couponApplied ? couponCode : undefined,
                note:          data.note,
            })
            await clearCart({ callApi: false })
            toast.success("Order placed successfully!")
            navigate.push(`/orders/${order._id}`)
        } catch (error: unknown) {
            toastApiError(error, "Order failed")
        } finally {
            setLoading(false)
        }
    }

    const finalAmount = (cart?.finalAmount || 0) - discount

    return (
        <main style={{
            minHeight: "100vh",
            background: "#f3f4f6",
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
                        <CreditCard size={13} /> Checkout
                    </div>

                    <h1 style={{
                        margin: 0, fontSize: "clamp(28px, 4vw, 42px)",
                        fontWeight: 800, color: "#111827", lineHeight: 1.15,
                        letterSpacing: "-0.5px"
                    }}>
                        Complete Your{" "}
                        <span style={{
                            background: "linear-gradient(135deg, #f97316, #fb923c)",
                            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                            backgroundClip: "text"
                        }}>
                            Order
                        </span>
                    </h1>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Left - Address + Options */}
                        <div className="lg:col-span-2 flex flex-col gap-6">

                            {/* Delivery Address */}
                            <div style={{ background: "#fff", borderRadius: 24, border: "1px solid #e5e7eb", padding: 30, boxShadow: "0 4px 15px rgba(0,0,0,0.02)" }}>
                                <h2 style={{ margin: "0 0 20px", fontSize: 20, fontWeight: 800, color: "#111827", display: "flex", alignItems: "center", gap: 10 }}>
                                    <div style={{ background: "#fff7ed", color: "#f97316", padding: 8, borderRadius: 10 }}>
                                        <MapPin size={20} />
                                    </div>
                                    Delivery Address
                                </h2>

                                {addresses.length === 0 ? (
                                    <div style={{ padding: "20px 0", color: "#6b7280", fontSize: 15 }}>
                                        No addresses found. Please add an address in your profile to continue.
                                    </div>
                                ) : (
                                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                        {addresses.map(addr => (
                                            <label
                                                key={addr._id}
                                                style={{
                                                    display: "flex", gap: 16, padding: 20, borderRadius: 16, cursor: "pointer", transition: "all .2s ease",
                                                    border: selectedAddress === addr._id ? "2px solid #f97316" : "2px solid #f3f4f6",
                                                    background: selectedAddress === addr._id ? "#fffaf5" : "#fff",
                                                    boxShadow: selectedAddress === addr._id ? "0 4px 14px rgba(249,115,22,0.08)" : "none"
                                                }}
                                                className="hover:border-orange-200 hover:bg-orange-50/50"
                                            >
                                                <input
                                                    type="radio"
                                                    name="address"
                                                    value={addr._id}
                                                    checked={selectedAddress === addr._id}
                                                    onChange={() => setSelectedAddress(addr._id)}
                                                    style={{ width: 20, height: 20, accentColor: "#f97316", marginTop: 2 }}
                                                />
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                                                        <p style={{ margin: 0, fontWeight: 700, fontSize: 16, color: "#111827" }}>
                                                            {addr.fullName}
                                                        </p>
                                                        {addr.isDefault && (
                                                            <span style={{ background: "#ffedd5", color: "#c2410c", padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>
                                                                Default
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p style={{ margin: "0 0 4px", fontSize: 14, color: "#4b5563", lineHeight: 1.5 }}>
                                                        {addr.street}, {addr.city}, {addr.province}
                                                    </p>
                                                    <p style={{ margin: 0, fontSize: 13, color: "#6b7280", display: "flex", alignItems: "center", gap: 6 }}>
                                                        📞 {addr.phone}
                                                    </p>
                                                </div>
                                                {selectedAddress === addr._id && (
                                                    <CheckCircle2 size={24} color="#f97316" style={{ alignSelf: "center" }} />
                                                )}
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Payment Method */}
                            <div style={{ background: "#fff", borderRadius: 24, border: "1px solid #e5e7eb", padding: 30, boxShadow: "0 4px 15px rgba(0,0,0,0.02)" }}>
                                <h2 style={{ margin: "0 0 20px", fontSize: 20, fontWeight: 800, color: "#111827", display: "flex", alignItems: "center", gap: 10 }}>
                                    <div style={{ background: "#fff7ed", color: "#f97316", padding: 8, borderRadius: 10 }}>
                                        <CreditCard size={20} />
                                    </div>
                                    Payment Method
                                </h2>
                                <label style={{
                                    display: "flex", alignItems: "center", gap: 16, padding: 20, borderRadius: 16,
                                    border: "2px solid #f97316", background: "#fffaf5", cursor: "pointer",
                                    boxShadow: "0 4px 14px rgba(249,115,22,0.08)"
                                }}>
                                    <input
                                        type="radio"
                                        defaultChecked
                                        style={{ width: 20, height: 20, accentColor: "#f97316" }}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <p style={{ margin: 0, fontWeight: 700, fontSize: 16, color: "#111827" }}>
                                            Cash on Delivery (COD)
                                        </p>
                                        <p style={{ margin: "4px 0 0", fontSize: 14, color: "#6b7280" }}>
                                            Pay in cash when your order is delivered to your doorstep.
                                        </p>
                                    </div>
                                    <CheckCircle2 size={24} color="#f97316" />
                                </label>
                            </div>

                            {/* Order Note */}
                            <div style={{ background: "#fff", borderRadius: 24, border: "1px solid #e5e7eb", padding: 30, boxShadow: "0 4px 15px rgba(0,0,0,0.02)" }}>
                                <h2 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 800, color: "#111827" }}>
                                    Order Note <span style={{ color: "#9ca3af", fontWeight: 500, fontSize: 14 }}>(Optional)</span>
                                </h2>
                                <textarea
                                    {...register("note")}
                                    placeholder="Any special instructions for delivery..."
                                    rows={3}
                                    style={{
                                        width: "100%", padding: 16, borderRadius: 16, border: "1px solid #e5e7eb",
                                        background: "#f9fafb", fontSize: 15, color: "#374151", outline: "none",
                                        resize: "none", transition: "border .2s"
                                    }}
                                    className="focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
                                />
                            </div>
                        </div>

                        {/* Right - Summary */}
                        <div className="lg:col-span-1">
                            <div style={{
                                background: "#fff", borderRadius: 24, border: "1px solid #e5e7eb",
                                padding: 30, boxShadow: "0 10px 40px rgba(0,0,0,0.04)",
                                position: "sticky", top: 100
                            }}>
                                <h2 style={{ margin: "0 0 24px", fontSize: 20, fontWeight: 800, color: "#111827" }}>
                                    Order Summary
                                </h2>

                                {/* Items List Mini */}
                                <div style={{ display: "flex", flexDirection: "column", gap: 16, maxHeight: 280, overflowY: "auto", paddingRight: 8, marginBottom: 24 }}>
                                    {cart?.items.map(item => (
                                        <div key={item.book._id} style={{ display: "flex", gap: 14, alignItems: "center" }}>
                                            <div style={{
                                                width: 48, height: 68, borderRadius: 8, overflow: "hidden", flexShrink: 0,
                                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)", border: "1px solid #f3f4f6"
                                            }}>
                                                <img
                                                    src={item.book.coverImage || item.book.thumbnail}
                                                    alt={item.book.title}
                                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                    onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/48x68?text=Book" }}
                                                />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ margin: "0 0 4px", color: "#374151", fontWeight: 600, fontSize: 13, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: 1.3 }}>
                                                    {item.book.title}
                                                </p>
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                    <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 500 }}>Qty: {item.quantity}</span>
                                                    <span style={{ fontSize: 13, color: "#f97316", fontWeight: 700 }}>
                                                        Rs. {(item.price * item.quantity).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ width: "100%", height: 1, background: "#e5e7eb", margin: "0 0 24px" }} />

                                {/* Coupon Input */}
                                <div style={{ marginBottom: 24 }}>
                                    <label style={{ display: "block", margin: "0 0 8px", fontSize: 13, fontWeight: 700, color: "#4b5563", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                        Have a Coupon?
                                    </label>
                                    <div style={{ display: "flex", gap: 8 }}>
                                        <div style={{ position: "relative", flex: 1 }}>
                                            <Tag size={16} color="#9ca3af" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                                            <input
                                                type="text"
                                                {...register("couponCode")}
                                                placeholder="Enter code"
                                                disabled={couponApplied}
                                                style={{
                                                    width: "100%", padding: "12px 14px 12px 40px", borderRadius: 12,
                                                    border: "1px solid #e5e7eb", background: couponApplied ? "#f9fafb" : "#fff",
                                                    fontSize: 14, outline: "none", color: "#111827", transition: "border .2s"
                                                }}
                                                className={couponApplied ? "" : "focus:border-orange-400 focus:ring-2 focus:ring-orange-100"}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleApplyCoupon}
                                            disabled={couponApplied}
                                            style={{
                                                background: couponApplied ? "#f3f4f6" : "#f97316",
                                                color: couponApplied ? "#9ca3af" : "#fff",
                                                border: "none", padding: "0 20px", borderRadius: 12, fontSize: 14, fontWeight: 700,
                                                cursor: couponApplied ? "not-allowed" : "pointer", transition: "all .2s ease"
                                            }}
                                            className={couponApplied ? "" : "hover:bg-orange-600 active:scale-95"}
                                        >
                                            {couponApplied ? "Applied" : "Apply"}
                                        </button>
                                    </div>
                                </div>

                                {/* Pricing Breakdown */}
                                <div style={{ display: "flex", flexDirection: "column", gap: 14, fontSize: 14, color: "#4b5563" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <span>Subtotal</span>
                                        <span style={{ fontWeight: 600, color: "#111827" }}>Rs. {cart?.totalAmount?.toLocaleString()}</span>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <span>Delivery</span>
                                        <span style={{ fontWeight: 600, color: cart?.isFreeDelivery ? "#10b981" : "#111827" }}>
                                            {cart?.isFreeDelivery ? "FREE" : `Rs. ${cart?.deliveryCharges}`}
                                        </span>
                                    </div>
                                    {discount > 0 && (
                                        <div style={{ display: "flex", justifyContent: "space-between", color: "#10b981", fontWeight: 600 }}>
                                            <span>Coupon Discount</span>
                                            <span>- Rs. {discount.toLocaleString()}</span>
                                        </div>
                                    )}
                                    <div style={{ borderTop: "1px dashed #d1d5db", margin: "8px 0" }} />
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <span style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>Total Payable</span>
                                        <span style={{ fontSize: 24, fontWeight: 800, color: "#f97316" }}>
                                            Rs. {finalAmount.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Place Order Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        width: "100%", marginTop: 32, padding: "16px", borderRadius: 14,
                                        background: loading ? "#fdba74" : "linear-gradient(135deg, #f97316, #fb923c)",
                                        color: "#fff", border: "none", fontSize: 16, fontWeight: 700,
                                        cursor: loading ? "not-allowed" : "pointer",
                                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                                        boxShadow: loading ? "none" : "0 6px 20px rgba(249,115,22,0.3)",
                                        transition: "transform .2s ease"
                                    }}
                                    className={loading ? "" : "hover:scale-[1.02] active:scale-[0.98]"}
                                >
                                    {loading && <Loader2 size={18} className="animate-spin" />}
                                    {loading ? "Placing Order..." : "Place Order Securely"}
                                    {!loading && <ArrowRight size={18} />}
                                </button>

                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 20, color: "#6b7280", fontSize: 13 }}>
                                    <ShieldCheck size={16} className="text-green-500" /> Secure SSL Encrypted Checkout
                                </div>
                            </div>
                        </div>

                    </div>
                </form>
            </div>
        </main>
    )
}

export default Checkout