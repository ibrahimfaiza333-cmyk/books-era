"use client";
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus, Trash2, ToggleLeft, ToggleRight, Edit2, X, Loader2, Tag, CheckCircle, XCircle } from "lucide-react"
import { getAdminCoupons, createCoupon, updateCoupon, deleteCoupon, toggleCouponStatus } from "../../api/coupons.api"
import AdminLayout from "../../components/admin/AdminLayout"
import { toast } from "react-toastify";
import { toastApiError } from "../../lib/api-error"

interface CouponForm {
    code: string
    description: string
    discountType: "percentage" | "fixed"
    discountValue: number
    minOrderAmount: number
    maxDiscountAmount: number
    expiryDate: string
    usageLimit: number
}

const empty: CouponForm = {
    code: "", description: "", discountType: "percentage",
    discountValue: 0, minOrderAmount: 0, maxDiscountAmount: 0,
    expiryDate: "", usageLimit: 0
}

const ManageCoupons = () => {
    const queryClient = useQueryClient()
    const [showModal, setShowModal] = useState(false)
    const [editId, setEditId] = useState<string | null>(null)
    const [form, setForm] = useState<CouponForm>(empty)

    const { data: coupons = [], isLoading } = useQuery({
        queryKey: ["admin-coupons"],
        queryFn: getAdminCoupons,
    })

    const saveMutation = useMutation({
        mutationFn: (data: CouponForm) =>
            editId ? updateCoupon(editId, data) : createCoupon(data),
        onSuccess: () => {
            toast.success(editId ? "Coupon updated!" : "Coupon created!")
            queryClient.invalidateQueries({ queryKey: ["admin-coupons"] })
            closeModal()
        },
        onError: (err: any) => toastApiError(err, "Failed to save coupon")
    })

    const toggleMutation = useMutation({
        mutationFn: (id: string) => toggleCouponStatus(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-coupons"] })
        },
        onError: (err: any) => toastApiError(err, "Failed to toggle status")
    })

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteCoupon(id),
        onSuccess: () => {
            toast.success("Coupon deleted!")
            queryClient.invalidateQueries({ queryKey: ["admin-coupons"] })
        },
        onError: (err: any) => toastApiError(err, "Failed to delete coupon")
    })

    const openCreate = () => { setEditId(null); setForm(empty); setShowModal(true) }
    const openEdit = (coupon: any) => {
        setEditId(coupon._id)
        setForm({
            code: coupon.code,
            description: coupon.description || "",
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            minOrderAmount: coupon.minOrderAmount || 0,
            maxDiscountAmount: coupon.maxDiscountAmount || 0,
            expiryDate: coupon.expiryDate?.slice(0, 10) || "",
            usageLimit: coupon.usageLimit || 0
        })
        setShowModal(true)
    }
    const closeModal = () => { setShowModal(false); setEditId(null); setForm(empty) }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    }
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        saveMutation.mutate(form)
    }

    const inputStyle: React.CSSProperties = {
        width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid #e5e7eb",
        fontSize: 14, outline: "none", background: "#f9fafb", color: "#111827"
    }

    return (
        <AdminLayout title="Manage Coupons">
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#111827" }}>Discount Coupons</h2>
                        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6b7280" }}>{coupons.length} coupon(s) total</p>
                    </div>
                    <button
                        onClick={openCreate}
                        style={{
                            display: "flex", alignItems: "center", gap: 8,
                            padding: "11px 22px", borderRadius: 12,
                            background: "linear-gradient(135deg, #e1711c, #ff8a3d)",
                            color: "#fff", border: "none", fontWeight: 700,
                            fontSize: 14, cursor: "pointer",
                            boxShadow: "0 4px 12px rgba(225,113,28,0.3)"
                        }}
                    >
                        <Plus size={17} /> Create Coupon
                    </button>
                </div>

                {/* Table */}
                <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #eef0f5", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", overflow: "hidden" }}>
                    {isLoading ? (
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: 60 }}>
                            <Loader2 size={28} style={{ animation: "spin 1s linear infinite", color: "#e1711c" }} />
                        </div>
                    ) : coupons.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "60px 20px" }}>
                            <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#fff7ed", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                                <Tag size={26} color="#e1711c" />
                            </div>
                            <p style={{ margin: 0, fontWeight: 700, color: "#374151" }}>No coupons yet</p>
                            <p style={{ margin: "6px 0 0", fontSize: 13, color: "#9ca3af" }}>Create your first discount coupon above.</p>
                        </div>
                    ) : (
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr style={{ background: "#fafafa", borderBottom: "1px solid #f3f4f6" }}>
                                        {["Code", "Type", "Value", "Min Order", "Expiry", "Status", "Actions"].map(h => (
                                            <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {coupons.map((c: any) => {
                                        const isExpired = new Date(c.expiryDate) < new Date()
                                        return (
                                            <tr key={c._id} style={{ borderBottom: "1px solid #f9fafb" }}
                                                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#fafafa"}
                                                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                                            >
                                                <td style={{ padding: "14px 20px" }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                        <div style={{ width: 34, height: 34, borderRadius: 10, background: "#fff7ed", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                            <Tag size={15} color="#e1711c" />
                                                        </div>
                                                        <div>
                                                            <p style={{ margin: 0, fontWeight: 800, fontSize: 13.5, color: "#111827", fontFamily: "monospace" }}>{c.code}</p>
                                                            {c.description && <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>{c.description}</p>}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ padding: "14px 20px" }}>
                                                    <span style={{ padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: c.discountType === "percentage" ? "#ede9fe" : "#dbeafe", color: c.discountType === "percentage" ? "#6d28d9" : "#1d4ed8" }}>
                                                        {c.discountType}
                                                    </span>
                                                </td>
                                                <td style={{ padding: "14px 20px", fontWeight: 700, color: "#e1711c", fontSize: 14 }}>
                                                    {c.discountType === "percentage" ? `${c.discountValue}%` : `Rs. ${c.discountValue}`}
                                                    {c.maxDiscountAmount > 0 && <span style={{ fontSize: 11, color: "#9ca3af", display: "block", fontWeight: 500 }}>Max Rs. {c.maxDiscountAmount}</span>}
                                                </td>
                                                <td style={{ padding: "14px 20px", fontSize: 13, color: "#4b5563", fontWeight: 600 }}>
                                                    Rs. {c.minOrderAmount || 0}
                                                </td>
                                                <td style={{ padding: "14px 20px", fontSize: 13, color: isExpired ? "#ef4444" : "#374151", fontWeight: 600 }}>
                                                    {new Date(c.expiryDate).toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric" })}
                                                    {isExpired && <span style={{ display: "block", fontSize: 11, color: "#ef4444" }}>Expired</span>}
                                                </td>
                                                <td style={{ padding: "14px 20px" }}>
                                                    {c.isActive && !isExpired ? (
                                                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 20, background: "#dcfce7", color: "#15803d", fontSize: 12, fontWeight: 700 }}>
                                                            <CheckCircle size={12} /> Active
                                                        </span>
                                                    ) : (
                                                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 20, background: "#fee2e2", color: "#b91c1c", fontSize: 12, fontWeight: 700 }}>
                                                            <XCircle size={12} /> Inactive
                                                        </span>
                                                    )}
                                                </td>
                                                <td style={{ padding: "14px 20px" }}>
                                                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                                        <button
                                                            onClick={() => toggleMutation.mutate(c._id)}
                                                            title={c.isActive ? "Deactivate" : "Activate"}
                                                            style={{ background: "none", border: "none", cursor: "pointer", color: c.isActive ? "#e1711c" : "#9ca3af", display: "flex" }}
                                                        >
                                                            {c.isActive ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                                                        </button>
                                                        <button
                                                            onClick={() => openEdit(c)}
                                                            style={{ width: 32, height: 32, borderRadius: 8, background: "#f3f4f6", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#374151" }}
                                                        >
                                                            <Edit2 size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => { if (confirm("Delete this coupon?")) deleteMutation.mutate(c._id) }}
                                                            style={{ width: 32, height: 32, borderRadius: 8, background: "#fee2e2", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#ef4444" }}
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
                    onClick={(e) => { if (e.target === e.currentTarget) closeModal() }}
                >
                    <div style={{ background: "#fff", borderRadius: 24, padding: 32, width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 25px 60px rgba(0,0,0,0.2)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#111827" }}>
                                {editId ? "Edit Coupon" : "Create Coupon"}
                            </h3>
                            <button onClick={closeModal} style={{ background: "#f3f4f6", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <X size={16} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                <div>
                                    <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Coupon Code *</label>
                                    <input name="code" value={form.code} onChange={handleChange} required placeholder="SAVE20" style={{ ...inputStyle, textTransform: "uppercase", fontFamily: "monospace" }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Discount Type *</label>
                                    <select name="discountType" value={form.discountType} onChange={handleChange} style={inputStyle}>
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed Amount (Rs.)</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                <div>
                                    <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                                        Discount Value * {form.discountType === "percentage" ? "(%)" : "(Rs.)"}
                                    </label>
                                    <input name="discountValue" type="number" value={form.discountValue} onChange={handleChange} required min="1" style={inputStyle} />
                                </div>
                                <div>
                                    <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Min Order Amount (Rs.)</label>
                                    <input name="minOrderAmount" type="number" value={form.minOrderAmount} onChange={handleChange} min="0" style={inputStyle} />
                                </div>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                {form.discountType === "percentage" && (
                                    <div>
                                        <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Max Discount (Rs.) <span style={{ color: "#9ca3af", fontWeight: 400 }}>(Optional)</span></label>
                                        <input name="maxDiscountAmount" type="number" value={form.maxDiscountAmount} onChange={handleChange} min="0" style={inputStyle} />
                                    </div>
                                )}
                                <div>
                                    <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Usage Limit <span style={{ color: "#9ca3af", fontWeight: 400 }}>(0 = unlimited)</span></label>
                                    <input name="usageLimit" type="number" value={form.usageLimit} onChange={handleChange} min="0" style={inputStyle} />
                                </div>
                            </div>

                            <div>
                                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Expiry Date *</label>
                                <input name="expiryDate" type="date" value={form.expiryDate} onChange={handleChange} required style={inputStyle} />
                            </div>

                            <div>
                                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Description <span style={{ color: "#9ca3af", fontWeight: 400 }}>(Optional)</span></label>
                                <input name="description" value={form.description} onChange={handleChange} placeholder="e.g. Eid special discount" style={inputStyle} />
                            </div>

                            <button
                                type="submit"
                                disabled={saveMutation.isPending}
                                style={{
                                    marginTop: 8, padding: "13px", borderRadius: 12,
                                    background: "linear-gradient(135deg, #e1711c, #ff8a3d)",
                                    color: "#fff", border: "none", fontWeight: 700,
                                    fontSize: 15, cursor: saveMutation.isPending ? "not-allowed" : "pointer",
                                    opacity: saveMutation.isPending ? 0.7 : 1,
                                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8
                                }}
                            >
                                {saveMutation.isPending && <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />}
                                {saveMutation.isPending ? "Saving..." : editId ? "Update Coupon" : "Create Coupon"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </AdminLayout>
    )
}

export default ManageCoupons
