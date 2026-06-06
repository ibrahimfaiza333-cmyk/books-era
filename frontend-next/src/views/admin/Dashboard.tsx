"use client";
// src/views/admin/Dashboard.tsx
import { useQuery } from "@tanstack/react-query"
import {
    Users, BookOpen, ShoppingBag,
    DollarSign, AlertTriangle, TrendingUp,
    Package, ArrowUpRight, Activity
} from "lucide-react"
import Link from "next/link";
import { getDashboardStats } from "../../api/admin.api"
import { queryKeys } from "../../lib/query-keys"
import AdminLayout from "../../components/admin/AdminLayout"
import type { Book, Order } from "@/types"

const statusStyles: Record<string, { bg: string; color: string; dot: string }> = {
    pending:    { bg: '#fef9c3', color: '#a16207', dot: '#eab308' },
    confirmed:  { bg: '#dbeafe', color: '#1d4ed8', dot: '#3b82f6' },
    processing: { bg: '#ede9fe', color: '#6d28d9', dot: '#8b5cf6' },
    shipped:    { bg: '#e0e7ff', color: '#3730a3', dot: '#6366f1' },
    delivered:  { bg: '#dcfce7', color: '#15803d', dot: '#22c55e' },
    cancelled:  { bg: '#fee2e2', color: '#b91c1c', dot: '#ef4444' },
}

/* ── Stat Card ─────────────────────────────────────────────── */
interface StatCardProps {
    title: string
    value: string | number
    sub?: string
    icon: React.ReactNode
    iconBg: string
    accentColor: string
    href?: string
}

const StatCard = ({ title, value, sub, icon, iconBg, accentColor, href }: StatCardProps) => (
    <div
        className="bg-white rounded-2xl flex items-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-default"
        style={{ padding: '22px 24px', border: '1px solid #eef0f5', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', gap: '18px' }}
    >
        <div
            className="flex items-center justify-center rounded-2xl flex-shrink-0"
            style={{ width: '52px', height: '52px', background: iconBg }}
        >
            {icon}
        </div>
        <div className="flex-1 min-w-0">
            <p style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{title}</p>
            <p style={{ fontSize: '22px', fontWeight: 800, color: '#111827', marginTop: '2px', lineHeight: 1 }}>{value}</p>
            {sub && <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>{sub}</p>}
        </div>
        {href && (
            <div
                className="flex-shrink-0 flex items-center justify-center rounded-xl"
                style={{ width: '32px', height: '32px', background: iconBg }}
            >
                <ArrowUpRight size={15} style={{ color: accentColor }} />
            </div>
        )}
    </div>
)

/* ── Dashboard ─────────────────────────────────────────────── */
const Dashboard = () => {
    const { data, isLoading } = useQuery({
        queryKey: queryKeys.adminDashboard,
        queryFn: getDashboardStats,
    })

    const stats        = data?.stats        || {}
    const recentOrders = data?.recentOrders || []
    const lowStock     = data?.lowStockBooks || []

    return (
        <AdminLayout title="Dashboard">
            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <div
                        className="w-10 h-10 border-4 rounded-full animate-spin"
                        style={{ borderColor: '#e1711c', borderTopColor: 'transparent' }}
                    />
                </div>
            ) : (
                <div className="flex flex-col" style={{ gap: '24px' }}>

                    {/* ── Welcome Banner ── */}
                    <div
                        className="rounded-2xl relative overflow-hidden"
                        style={{
                            background: 'linear-gradient(135deg, #0f1923 0%, #1a2d42 50%, #162035 100%)',
                            padding: '32px 36px',
                        }}
                    >
                        {/* Glowing orbs */}
                        <div className="absolute" style={{ right: '-40px', top: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(225,113,28,0.08)' }} />
                        <div className="absolute" style={{ right: '60px', bottom: '-60px', width: '140px', height: '140px', borderRadius: '50%', background: 'rgba(225,113,28,0.05)' }} />
                        <div className="absolute" style={{ right: '160px', top: '-20px', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(225,113,28,0.06)' }} />

                        <div className="relative flex items-center justify-between" style={{ zIndex: 1 }}>
                            <div>
                                <div className="flex items-center" style={{ gap: '8px', marginBottom: '10px' }}>
                                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#e1711c' }}>Welcome back 👋</span>
                                </div>
                                <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#ffffff', lineHeight: 1.2 }}>
                                    Here's what's happening today
                                </h2>
                                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginTop: '8px' }}>
                                    Monitor your bookstore performance from one central place.
                                </p>
                                <div className="flex items-center" style={{ gap: '12px', marginTop: '20px' }}>
                                    <Link
                                        href="/admin/reports"
                                        className="flex items-center rounded-xl font-semibold transition-all"
                                        style={{
                                            gap: '6px', padding: '10px 18px', fontSize: '13px',
                                            background: 'linear-gradient(135deg, #e1711c 0%, #ff8a3d 100%)',
                                            color: '#fff',
                                            boxShadow: '0 4px 12px rgba(225,113,28,0.35)'
                                        }}
                                    >
                                        <Activity size={14} /> View Reports
                                    </Link>
                                    <Link
                                        href="/admin/orders"
                                        className="flex items-center rounded-xl font-semibold transition-all"
                                        style={{
                                            gap: '6px', padding: '10px 18px', fontSize: '13px',
                                            background: 'rgba(255,255,255,0.08)',
                                            color: 'rgba(255,255,255,0.75)',
                                            border: '1px solid rgba(255,255,255,0.1)'
                                        }}
                                    >
                                        Manage Orders
                                    </Link>
                                </div>
                            </div>
                            <div
                                className="hidden lg:flex items-center justify-center rounded-2xl flex-shrink-0"
                                style={{
                                    width: '80px', height: '80px',
                                    background: 'rgba(225,113,28,0.12)',
                                    border: '1px solid rgba(225,113,28,0.25)'
                                }}
                            >
                                <TrendingUp size={34} style={{ color: '#e1711c' }} />
                            </div>
                        </div>
                    </div>

                    {/* ── Stats Grid ── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: '16px' }}>
                        <StatCard
                            title="Total Users"
                            value={stats.totalUsers || 0}
                            icon={<Users size={22} color="#3b82f6" />}
                            iconBg="rgba(59,130,246,0.1)"
                            accentColor="#3b82f6"
                            href="/admin/users"
                        />
                        <StatCard
                            title="Total Books"
                            value={stats.totalBooks || 0}
                            icon={<BookOpen size={22} color="#10b981" />}
                            iconBg="rgba(16,185,129,0.1)"
                            accentColor="#10b981"
                            href="/admin/books"
                        />
                        <StatCard
                            title="Total Orders"
                            value={stats.totalOrders || 0}
                            icon={<ShoppingBag size={22} color="#8b5cf6" />}
                            iconBg="rgba(139,92,246,0.1)"
                            accentColor="#8b5cf6"
                            href="/admin/orders"
                        />
                        <StatCard
                            title="Total Revenue"
                            value={`Rs. ${(stats.totalRevenue || 0).toLocaleString()}`}
                            sub={`Avg. Rs. ${(stats.avgOrderValue || 0).toLocaleString()} / order`}
                            icon={<DollarSign size={22} color="#e1711c" />}
                            iconBg="rgba(225,113,28,0.1)"
                            accentColor="#e1711c"
                        />
                    </div>

                    {/* ── Bottom Grid ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-3" style={{ gap: '20px' }}>

                        {/* Recent Orders */}
                        <div
                            className="lg:col-span-2 bg-white rounded-2xl"
                            style={{ border: '1px solid #eef0f5', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', overflow: 'hidden' }}
                        >
                            <div className="flex items-center justify-between" style={{ padding: '22px 24px 18px 24px', borderBottom: '1px solid #f3f4f6' }}>
                                <div>
                                    <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#111827' }}>Recent Orders</h2>
                                    <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>Latest 5 transactions</p>
                                </div>
                                <Link
                                    href="/admin/orders"
                                    className="flex items-center font-semibold rounded-xl transition-all"
                                    style={{
                                        gap: '5px', fontSize: '12px', padding: '7px 14px',
                                        color: '#e1711c', background: '#fff4ec', border: '1px solid #fde0c5'
                                    }}
                                >
                                    View All <ArrowUpRight size={13} />
                                </Link>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr style={{ background: '#fafafa', borderBottom: '1px solid #f3f4f6' }}>
                                            <th style={{ padding: '10px 24px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Order</th>
                                            <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Customer</th>
                                            <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Amount</th>
                                            <th style={{ padding: '10px 24px 10px 12px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentOrders.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                                                    No orders yet
                                                </td>
                                            </tr>
                                        ) : recentOrders.map((order: Order) => {
                                            const s = statusStyles[order.orderStatus] || { bg: '#f3f4f6', color: '#374151', dot: '#9ca3af' }
                                            return (
                                                <tr
                                                    key={order._id}
                                                    style={{ borderBottom: '1px solid #f9fafb' }}
                                                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#fafafa'}
                                                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                                                >
                                                    <td style={{ padding: '14px 24px' }}>
                                                        <Link
                                                            href="/admin/orders"
                                                            style={{ fontWeight: 700, color: '#111827', fontSize: '13px' }}
                                                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#e1711c'}
                                                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#111827'}
                                                        >
                                                            #{order.orderNumber}
                                                        </Link>
                                                    </td>
                                                    <td style={{ padding: '14px 12px', fontSize: '13px', color: '#4b5563', fontWeight: 500 }}>
                                                        {order.user?.fullName || "N/A"}
                                                    </td>
                                                    <td style={{ padding: '14px 12px', fontSize: '13px', color: '#111827', fontWeight: 700 }}>
                                                        Rs. {order.finalAmount?.toLocaleString()}
                                                    </td>
                                                    <td style={{ padding: '14px 24px 14px 12px' }}>
                                                        <span
                                                            className="flex items-center capitalize"
                                                            style={{
                                                                display: 'inline-flex', alignItems: 'center', gap: '5px',
                                                                fontSize: '11.5px', fontWeight: 700, padding: '4px 10px',
                                                                borderRadius: '20px', backgroundColor: s.bg, color: s.color
                                                            }}
                                                        >
                                                            <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: s.dot, display: 'inline-block', flexShrink: 0 }} />
                                                            {order.orderStatus}
                                                        </span>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Low Stock Alert */}
                        <div
                            className="bg-white rounded-2xl"
                            style={{ border: '1px solid #eef0f5', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', overflow: 'hidden' }}
                        >
                            <div
                                className="flex items-center"
                                style={{ padding: '22px 24px 18px 24px', borderBottom: '1px solid #f3f4f6', gap: '10px' }}
                            >
                                <div
                                    className="flex items-center justify-center rounded-xl"
                                    style={{ width: '36px', height: '36px', background: '#fff4ec' }}
                                >
                                    <AlertTriangle size={16} color="#e1711c" />
                                </div>
                                <div>
                                    <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', lineHeight: 1 }}>Low Stock Alert</h2>
                                    <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '3px' }}>Needs attention</p>
                                </div>
                            </div>

                            <div style={{ padding: '16px' }}>
                                {lowStock.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center" style={{ padding: '32px 0', gap: '12px' }}>
                                        <div
                                            className="flex items-center justify-center rounded-2xl"
                                            style={{ width: '52px', height: '52px', background: 'rgba(16,185,129,0.08)' }}
                                        >
                                            <Package size={22} color="#10b981" />
                                        </div>
                                        <p style={{ fontSize: '13px', color: '#4b5563', fontWeight: 600 }}>All books well stocked!</p>
                                        <p style={{ fontSize: '11px', color: '#94a3b8' }}>No restocking needed right now</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col" style={{ gap: '8px' }}>
                                        {lowStock.map((book: Book) => (
                                            <div
                                                key={book._id}
                                                className="flex items-center rounded-xl transition-all"
                                                style={{ padding: '10px 12px', background: '#f9fafb', gap: '10px' }}
                                                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#f3f4f6'}
                                                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#f9fafb'}
                                            >
                                                <div
                                                    className="flex items-center justify-center rounded-lg flex-shrink-0"
                                                    style={{ width: '30px', height: '30px', background: book.stock === 0 ? '#fee2e2' : '#fef9c3' }}
                                                >
                                                    <BookOpen size={13} color={book.stock === 0 ? '#b91c1c' : '#a16207'} />
                                                </div>
                                                <p style={{ fontSize: '12.5px', color: '#374151', flex: 1, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {book.title}
                                                </p>
                                                <span
                                                    style={{
                                                        fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '20px', flexShrink: 0,
                                                        background: book.stock === 0 ? '#fee2e2' : '#fef9c3',
                                                        color: book.stock === 0 ? '#b91c1c' : '#a16207'
                                                    }}
                                                >
                                                    {book.stock === 0 ? "Out" : `${book.stock} left`}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    )
}

export default Dashboard