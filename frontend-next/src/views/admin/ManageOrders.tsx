"use client";
// src/pages/admin/ManageOrders.tsx

import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Eye, Loader2, ShoppingBag, X, MapPin, Package } from "lucide-react"
import { getAdminOrders, updateOrderStatus } from "../../api/admin.api"
import { getApiErrorMessage } from "../../lib/api-error"
import { queryKeys } from "../../lib/query-keys"
import AdminLayout from "../../components/admin/AdminLayout"
import { toast } from "react-toastify";
import type { Order } from "../../types"

/* ── Status config ────────────────────────────────────────── */
const statusConfig: Record<string, { bg: string; color: string; dot: string }> = {
    pending:    { bg: '#fef9c3', color: '#a16207', dot: '#eab308' },
    confirmed:  { bg: '#dbeafe', color: '#1d4ed8', dot: '#3b82f6' },
    processing: { bg: '#ede9fe', color: '#6d28d9', dot: '#8b5cf6' },
    shipped:    { bg: '#e0e7ff', color: '#3730a3', dot: '#6366f1' },
    delivered:  { bg: '#dcfce7', color: '#15803d', dot: '#22c55e' },
    cancelled:  { bg: '#fee2e2', color: '#b91c1c', dot: '#ef4444' },
}

const paymentConfig: Record<string, { bg: string; color: string }> = {
    paid:    { bg: '#dcfce7', color: '#15803d' },
    pending: { bg: '#fef9c3', color: '#a16207' },
    failed:  { bg: '#fee2e2', color: '#b91c1c' },
}

const statuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]

/* ── Component ────────────────────────────────────────────── */
const ManageOrders = () => {
    const queryClient = useQueryClient()
    const [page, setPage]                     = useState(1)
    const [filterStatus, setFilterStatus]     = useState("")
    const [selectedOrder, setSelectedOrder]   = useState<Order | null>(null)
    const [newStatus, setNewStatus]           = useState("")
    const [updating, setUpdating]             = useState(false)

    const { data, isLoading } = useQuery({
        queryKey: queryKeys.adminOrders(page, filterStatus),
        queryFn: () => getAdminOrders(page, 10, filterStatus || undefined),
    })

    const orders: Order[]  = data?.orders     || []
    const totalPages: number = data?.totalPages || 1

    const handleUpdateStatus = async () => {
        if (!selectedOrder || !newStatus) return
        try {
            setUpdating(true)
            await updateOrderStatus(selectedOrder._id, newStatus)
            queryClient.invalidateQueries({ queryKey: queryKeys.adminOrdersRoot })
            toast.success("Status updated!")
            setSelectedOrder(null)
        } catch (error: unknown) {
            toast.error(getApiErrorMessage(error, "Failed to update order status"))
        } finally {
            setUpdating(false)
        }
    }

    return (
        <>
            <AdminLayout title="Manage Orders">
                <style>
                    {`
                    .orders-container {
                        display: flex;
                        flex-direction: column;
                        gap: 16px;
                    }
                    @media (min-width: 768px) {
                        .orders-container {
                            gap: 24px;
                        }
                    }
                    .filter-tabs {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 8px;
                        align-items: center;
                    }
                    .modal-content {
                        width: 95%;
                        max-width: 500px;
                        max-height: 90vh;
                    }
                    `}
                </style>
                <div className="orders-container">

                    {/* ── Filter Tabs ── */}
                    <div className="filter-tabs">
                        {/* All */}
                        <button
                            onClick={() => { setFilterStatus(""); setPage(1) }}
                            style={{
                                padding: '8px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 700,
                                border: !filterStatus ? 'none' : '1px solid #e8eaf0',
                                background: !filterStatus ? 'linear-gradient(135deg, #e1711c 0%, #ff8a3d 100%)' : '#fff',
                                color: !filterStatus ? '#fff' : '#64748b',
                                cursor: 'pointer',
                                boxShadow: !filterStatus ? '0 4px 10px rgba(225,113,28,0.25)' : 'none',
                                transition: 'all 0.2s',
                            }}
                        >
                            All Orders
                        </button>

                        {statuses.map(status => {
                            const cfg = statusConfig[status]
                            const isActive = filterStatus === status
                            return (
                                <button
                                    key={status}
                                    onClick={() => { setFilterStatus(status); setPage(1) }}
                                    style={{
                                        padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
                                        border: isActive ? 'none' : '1px solid #e8eaf0',
                                        background: isActive ? cfg.bg : '#fff',
                                        color: isActive ? cfg.color : '#64748b',
                                        cursor: 'pointer', textTransform: 'capitalize',
                                        transition: 'all 0.2s',
                                        display: 'flex', alignItems: 'center', gap: '6px',
                                    }}
                                    onMouseEnter={e => {
                                        if (!isActive) {
                                            (e.currentTarget as HTMLElement).style.background = cfg.bg
                                            ;(e.currentTarget as HTMLElement).style.color = cfg.color
                                            ;(e.currentTarget as HTMLElement).style.borderColor = 'transparent'
                                        }
                                    }}
                                    onMouseLeave={e => {
                                        if (!isActive) {
                                            (e.currentTarget as HTMLElement).style.background = '#fff'
                                            ;(e.currentTarget as HTMLElement).style.color = '#64748b'
                                            ;(e.currentTarget as HTMLElement).style.borderColor = '#e8eaf0'
                                        }
                                    }}
                                >
                                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: cfg.dot, display: 'inline-block' }} />
                                    {status}
                                </button>
                            )
                        })}
                    </div>

                    {/* ── Table Card ── */}
                    <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid #e8eaf0', boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                                <thead>
                                    <tr style={{ background: '#f8f9fb', borderBottom: '2px solid #eef0f5' }}>
                                        {['Order', 'Customer', 'Items', 'Amount', 'Payment', 'Status', 'Actions'].map(col => (
                                            <th key={col} style={{ padding: '14px 20px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap' }}>
                                                {col}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={7} style={{ padding: '64px', textAlign: 'center' }}>
                                                <div className="w-9 h-9 border-4 rounded-full animate-spin mx-auto" style={{ borderColor: '#e1711c', borderTopColor: 'transparent' }} />
                                            </td>
                                        </tr>
                                    ) : orders.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} style={{ padding: '64px', textAlign: 'center' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(225,113,28,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <ShoppingBag size={24} color="#e1711c" />
                                                    </div>
                                                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#64748b' }}>No orders found</p>
                                                    <p style={{ fontSize: '12px', color: '#94a3b8' }}>Try a different status filter</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : orders.map((order: Order) => {
                                        const sc = statusConfig[order.orderStatus]  || { bg: '#f3f4f6', color: '#374151', dot: '#9ca3af' }
                                        const pc = paymentConfig[order.paymentStatus] || { bg: '#f3f4f6', color: '#374151' }
                                        return (
                                            <tr
                                                key={order._id}
                                                style={{ borderBottom: '1px solid #f3f4f6', transition: 'background 0.15s' }}
                                                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#fafafa'}
                                                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                                            >
                                                {/* Order */}
                                                <td style={{ padding: '14px 20px' }}>
                                                    <p style={{ fontSize: '13.5px', fontWeight: 700, color: '#111827' }}>
                                                        #{order.orderNumber}
                                                    </p>
                                                    <p style={{ fontSize: '11.5px', color: '#94a3b8', marginTop: '3px' }}>
                                                        {new Date(order.createdAt).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </p>
                                                </td>

                                                {/* Customer */}
                                                <td style={{ padding: '14px 20px' }}>
                                                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>
                                                        {typeof order.user !== "string" ? order.user?.fullName : "N/A"}
                                                    </p>
                                                    <p style={{ fontSize: '11.5px', color: '#94a3b8', marginTop: '2px' }}>
                                                        {typeof order.user !== "string" ? order.user?.phone : ""}
                                                    </p>
                                                </td>

                                                {/* Items */}
                                                <td style={{ padding: '14px 20px' }}>
                                                    <span style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                                                        fontSize: '12px', fontWeight: 600, padding: '4px 10px',
                                                        borderRadius: '20px', background: '#f1f5f9', color: '#475569'
                                                    }}>
                                                        <Package size={12} />
                                                        {order.items.length} item{order.items.length > 1 ? 's' : ''}
                                                    </span>
                                                </td>

                                                {/* Amount */}
                                                <td style={{ padding: '14px 20px' }}>
                                                    <p style={{ fontSize: '13.5px', fontWeight: 700, color: '#e1711c' }}>
                                                        Rs. {order.finalAmount.toLocaleString()}
                                                    </p>
                                                </td>

                                                {/* Payment */}
                                                <td style={{ padding: '14px 20px' }}>
                                                    <span style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                                                        fontSize: '11.5px', fontWeight: 700, padding: '4px 10px',
                                                        borderRadius: '20px', textTransform: 'capitalize',
                                                        background: pc.bg, color: pc.color,
                                                    }}>
                                                        {order.paymentStatus}
                                                    </span>
                                                </td>

                                                {/* Status */}
                                                <td style={{ padding: '14px 20px' }}>
                                                    <span style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                                                        fontSize: '11.5px', fontWeight: 700, padding: '4px 10px',
                                                        borderRadius: '20px', textTransform: 'capitalize',
                                                        background: sc.bg, color: sc.color,
                                                    }}>
                                                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: sc.dot, flexShrink: 0 }} />
                                                        {order.orderStatus}
                                                    </span>
                                                </td>

                                                {/* Action */}
                                                <td style={{ padding: '14px 20px' }}>
                                                    <button
                                                        onClick={() => { setSelectedOrder(order); setNewStatus(order.orderStatus) }}
                                                        style={{
                                                            width: '34px', height: '34px', borderRadius: '10px',
                                                            border: '1px solid #e8eaf0', background: '#fff',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            color: '#94a3b8', cursor: 'pointer', transition: 'all 0.15s'
                                                        }}
                                                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#fff4ec'; (e.currentTarget as HTMLElement).style.borderColor = '#fde0c5'; (e.currentTarget as HTMLElement).style.color = '#e1711c' }}
                                                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#fff'; (e.currentTarget as HTMLElement).style.borderColor = '#e8eaf0'; (e.currentTarget as HTMLElement).style.color = '#94a3b8' }}
                                                    >
                                                        <Eye size={15} />
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', padding: '16px 24px', borderTop: '1px solid #f3f4f6' }}>
                                <button
                                    onClick={() => setPage(prev => Math.max(1, prev - 1))}
                                    disabled={page === 1}
                                    style={{
                                        padding: '8px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
                                        border: '1px solid #e8eaf0', background: '#fff', color: '#374151',
                                        cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.4 : 1,
                                    }}
                                >
                                    ← Prev
                                </button>
                                <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>
                                    Page <strong style={{ color: '#111827' }}>{page}</strong> of <strong style={{ color: '#111827' }}>{totalPages}</strong>
                                </span>
                                <button
                                    onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={page === totalPages}
                                    style={{
                                        padding: '8px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
                                        border: '1px solid #e8eaf0', background: '#fff', color: '#374151',
                                        cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.4 : 1,
                                    }}
                                >
                                    Next →
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Order Detail Modal ── */}
                {selectedOrder && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
                        <div className="modal-content" style={{ background: '#fff', borderRadius: '20px', overflowY: 'auto', boxShadow: '0 24px 60px rgba(0,0,0,0.2)' }}>

                            {/* Modal Header */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #f3f4f6' }}>
                                <div>
                                    <p style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Order Details</p>
                                    <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#111827', marginTop: '2px' }}>
                                        #{selectedOrder.orderNumber}
                                    </h2>
                                </div>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    style={{ width: '34px', height: '34px', borderRadius: '10px', border: '1px solid #e8eaf0', background: '#f8f9fb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', cursor: 'pointer' }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#fee2e2'; (e.currentTarget as HTMLElement).style.color = '#ef4444' }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#f8f9fb'; (e.currentTarget as HTMLElement).style.color = '#64748b' }}
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

                                {/* Items */}
                                <div>
                                    <p style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '10px' }}>
                                        Ordered Items
                                    </p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {selectedOrder.items.map((item, index) => (
                                            <div key={index} style={{ display: 'flex', gap: '12px', padding: '10px', borderRadius: '12px', background: '#f8f9fb', border: '1px solid #f0f1f3', flexWrap: 'wrap' }}>
                                                <img
                                                    src={item.coverImage}
                                                    alt={item.title}
                                                    style={{ width: '40px', height: '54px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
                                                />
                                                <div style={{ flex: 1, minWidth: '150px' }}>
                                                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#111827', lineHeight: 1.3 }}>{item.title}</p>
                                                    <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                                                        x{item.quantity} × Rs. {item.price.toLocaleString()}
                                                    </p>
                                                </div>
                                                <p style={{ fontSize: '13px', fontWeight: 700, color: '#e1711c', whiteSpace: 'nowrap' }}>
                                                    Rs. {(item.price * item.quantity).toLocaleString()}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Delivery Address */}
                                <div style={{ padding: '14px 16px', borderRadius: '12px', background: '#f8f9fb', border: '1px solid #f0f1f3' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                                        <MapPin size={13} color="#e1711c" />
                                        <p style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Delivery Address</p>
                                    </div>
                                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#111827', wordBreak: 'break-word' }}>
                                        {selectedOrder.shippingAddress.fullName} · {selectedOrder.shippingAddress.phone}
                                    </p>
                                    <p style={{ fontSize: '12.5px', color: '#64748b', marginTop: '4px', wordBreak: 'break-word' }}>
                                        {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city}
                                    </p>
                                </div>

                                {/* Total */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: '12px', background: '#fff4ec', border: '1px solid #fde0c5' }}>
                                    <p style={{ fontSize: '13px', fontWeight: 700, color: '#92400e' }}>Total Amount</p>
                                    <p style={{ fontSize: '16px', fontWeight: 800, color: '#e1711c' }}>
                                        Rs. {selectedOrder.finalAmount.toLocaleString()}
                                    </p>
                                </div>

                                {/* Update Status */}
                                {selectedOrder.orderStatus !== "cancelled" && selectedOrder.orderStatus !== "delivered" && (
                                    <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '16px' }}>
                                        <p style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '10px' }}>
                                            Update Status
                                        </p>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                            <select
                                                value={newStatus}
                                                onChange={e => setNewStatus(e.target.value)}
                                                style={{
                                                    flex: 1, border: '1px solid #e8eaf0', borderRadius: '12px',
                                                    padding: '10px 14px', fontSize: '13px', outline: 'none',
                                                    background: '#fff', color: '#374151', fontWeight: 500, minWidth: '120px'
                                                }}
                                            >
                                                {statuses.map(status => (
                                                    <option key={status} value={status} style={{ textTransform: 'capitalize' }}>
                                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                                    </option>
                                                ))}
                                            </select>

                                            <button
                                                onClick={handleUpdateStatus}
                                                disabled={updating}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: '6px',
                                                    padding: '10px 20px', borderRadius: '12px', border: 'none',
                                                    background: 'linear-gradient(135deg, #e1711c 0%, #ff8a3d 100%)',
                                                    color: '#fff', fontSize: '13px', fontWeight: 700,
                                                    cursor: updating ? 'not-allowed' : 'pointer',
                                                    opacity: updating ? 0.7 : 1,
                                                    boxShadow: '0 4px 10px rgba(225,113,28,0.3)',
                                                    flex: '1 1 auto', justifyContent: 'center'
                                                }}
                                            >
                                                {updating && <Loader2 size={14} className="animate-spin" />}
                                                Update
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </AdminLayout>
        </>
    )
}

export default ManageOrders