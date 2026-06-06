"use client";
// src/views/admin/ManageReports.tsx
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { DollarSign, ShoppingBag, Calendar, ArrowUpRight, Percent, Award, CreditCard, PieChart } from "lucide-react"
import { getSalesReport } from "../../api/admin.api"
import AdminLayout from "../../components/admin/AdminLayout"
import StatsCard from "../../components/admin/StatsCard"

const ManageReports = () => {
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [tempStartDate, setTempStartDate] = useState("")
    const [tempEndDate, setTempEndDate] = useState("")

    const { data, isLoading } = useQuery({
        queryKey: ["salesReport", startDate, endDate],
        queryFn: () => getSalesReport(startDate || undefined, endDate || undefined),
    })

    const handleApplyFilter = (e: React.FormEvent) => {
        e.preventDefault()
        setStartDate(tempStartDate)
        setEndDate(tempEndDate)
    }

    const handleResetFilter = () => {
        setTempStartDate("")
        setTempEndDate("")
        setStartDate("")
        setEndDate("")
    }

    const overview = data?.overview || { totalRevenue: 0, totalOrders: 0, avgOrder: 0, totalDiscount: 0 }
    const topBooks = data?.topBooks || []
    const paymentMethods = data?.paymentMethods || []
    const ordersByStatus = data?.ordersByStatus || []

    const maxStatusCount = Math.max(...ordersByStatus.map((o: any) => o.count), 1)
    const maxPaymentTotal = Math.max(...paymentMethods.map((p: any) => p.total), 1)

    return (
        <AdminLayout title="Sales & Performance Reports">
            <style>
                {`
                .reports-container {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                .reports-filter-form {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                .reports-filter-inputs {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    width: 100%;
                }
                .report-input-group {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    width: 100%;
                }
                .report-input {
                    width: 100%;
                    outline: none;
                    font-size: 13px;
                    font-weight: 600;
                    color: #111827;
                    border: 1px solid #e8eaf0;
                    border-radius: 12px;
                    padding: 10px 14px;
                    background: #f8f9fb;
                    transition: all 0.2s;
                }
                .report-buttons {
                    display: flex;
                    gap: 10px;
                    width: 100%;
                }
                .report-btn {
                    flex: 1;
                    justify-content: center;
                }
                .reports-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 16px;
                }
                .reports-mid-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 16px;
                }
                .reports-mid-span {
                    grid-column: span 1;
                }
                @media (min-width: 640px) {
                    .reports-container {
                        gap: 24px;
                    }
                    .reports-filter-inputs {
                        flex-direction: row;
                        align-items: flex-end;
                    }
                    .report-input-group {
                        width: auto;
                    }
                    .report-input {
                        width: 160px;
                    }
                    .report-buttons {
                        width: auto;
                    }
                    .report-btn {
                        flex: none;
                    }
                    .reports-grid {
                        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                        gap: 20px;
                    }
                }
                @media (min-width: 1024px) {
                    .reports-filter-form {
                        flex-direction: row;
                        justify-content: space-between;
                        align-items: flex-end;
                    }
                    .reports-mid-grid {
                        grid-template-columns: repeat(3, 1fr);
                        gap: 24px;
                    }
                    .reports-mid-span {
                        grid-column: span 2;
                    }
                }
                `}
            </style>
            <div className="reports-container">

                {/* Header & Date Filter Panel */}
                <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e8eaf0', boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>
                    <form onSubmit={handleApplyFilter} className="reports-filter-form">
                        
                        <div className="reports-filter-inputs">
                            <div className="report-input-group">
                                <label style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Start Date</label>
                                <input
                                    type="date"
                                    value={tempStartDate}
                                    onChange={(e) => setTempStartDate(e.target.value)}
                                    className="report-input"
                                    onFocus={e => { (e.currentTarget as HTMLElement).style.borderColor = '#e1711c'; (e.currentTarget as HTMLElement).style.background = '#fff' }}
                                    onBlur={e => { (e.currentTarget as HTMLElement).style.borderColor = '#e8eaf0'; (e.currentTarget as HTMLElement).style.background = '#f8f9fb' }}
                                />
                            </div>

                            <div className="report-input-group">
                                <label style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>End Date</label>
                                <input
                                    type="date"
                                    value={tempEndDate}
                                    onChange={(e) => setTempEndDate(e.target.value)}
                                    className="report-input"
                                    onFocus={e => { (e.currentTarget as HTMLElement).style.borderColor = '#e1711c'; (e.currentTarget as HTMLElement).style.background = '#fff' }}
                                    onBlur={e => { (e.currentTarget as HTMLElement).style.borderColor = '#e8eaf0'; (e.currentTarget as HTMLElement).style.background = '#f8f9fb' }}
                                />
                            </div>

                            <div className="report-buttons">
                                <button
                                    type="submit"
                                    className="report-btn"
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '8px',
                                        padding: '10px 20px', borderRadius: '12px', border: 'none',
                                        background: 'linear-gradient(135deg, #e1711c 0%, #ff8a3d 100%)', color: '#fff',
                                        fontSize: '13px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(225,113,28,0.25)',
                                        transition: 'transform 0.15s ease'
                                    }}
                                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'}
                                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'}
                                >
                                    <Calendar size={15} />
                                    Generate
                                </button>
                                {(startDate || endDate || tempStartDate || tempEndDate) && (
                                    <button
                                        type="button"
                                        onClick={handleResetFilter}
                                        className="report-btn"
                                        style={{
                                            padding: '10px 20px', borderRadius: '12px', border: '1px solid #e8eaf0',
                                            background: '#fff', color: '#64748b', fontSize: '13px', fontWeight: 600,
                                            cursor: 'pointer', transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#f8f9fb'; (e.currentTarget as HTMLElement).style.color = '#374151' }}
                                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#fff'; (e.currentTarget as HTMLElement).style.color = '#64748b' }}
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                        </div>

                        <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#64748b', padding: '10px 16px', background: '#f8f9fb', borderRadius: '10px', border: '1px solid #e8eaf0' }}>
                            {startDate || endDate ? (
                                <span>Report range: <strong style={{ color: '#111827' }}>{startDate || "Beginning"}</strong> to <strong style={{ color: '#111827' }}>{endDate || "Today"}</strong></span>
                            ) : (
                                <span>Showing lifetime sales report</span>
                            )}
                        </div>
                    </form>
                </div>

                {isLoading ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '240px' }}>
                        <div className="w-10 h-10 border-4 rounded-full animate-spin" style={{ borderColor: '#e1711c', borderTopColor: 'transparent' }} />
                    </div>
                ) : (
                    <>
                        {/* Stats Overview */}
                        <div className="reports-grid">
                            <StatsCard
                                title="Sales Revenue"
                                value={`Rs. ${overview.totalRevenue.toLocaleString()}`}
                                icon={<DollarSign size={22} style={{ color: '#e1711c' }} />}
                                color="bg-orange-50"
                            />
                            <StatsCard
                                title="Orders Count"
                                value={overview.totalOrders}
                                icon={<ShoppingBag size={22} className="text-blue-500" />}
                                color="bg-blue-50"
                            />
                            <StatsCard
                                title="Average Order Value"
                                value={`Rs. ${overview.avgOrder.toLocaleString()}`}
                                icon={<ArrowUpRight size={22} className="text-emerald-500" />}
                                color="bg-emerald-50"
                            />
                            <StatsCard
                                title="Discount Issued"
                                value={`Rs. ${overview.totalDiscount.toLocaleString()}`}
                                icon={<Percent size={22} className="text-violet-500" />}
                                color="bg-violet-50"
                            />
                        </div>

                        {/* Middle Section: Top Books & Status Distribution */}
                        <div className="reports-mid-grid">

                            {/* Top Selling Books */}
                            <div className="reports-mid-span" style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e8eaf0', boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(225,113,28,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Award size={16} style={{ color: '#e1711c' }} />
                                    </div>
                                    <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#111827', margin: 0 }}>Top 5 Selling Books</h3>
                                </div>

                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '400px' }}>
                                        <thead>
                                            <tr style={{ background: '#f8f9fb', borderBottom: '2px solid #eef0f5' }}>
                                                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Book Info</th>
                                                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Units Sold</th>
                                                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Total Sales</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {topBooks.length === 0 ? (
                                                <tr>
                                                    <td colSpan={3} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', fontSize: '13px', fontWeight: 500 }}>No sales data found</td>
                                                </tr>
                                            ) : topBooks.map((book: any) => (
                                                <tr key={book._id} style={{ borderBottom: '1px solid #f3f4f6', transition: 'background 0.15s' }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#fafafa'} onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                                                    <td style={{ padding: '12px 16px' }}>
                                                        <p style={{ fontSize: '13.5px', fontWeight: 700, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>
                                                            {book.title || `Book ID: ${book._id}`}
                                                        </p>
                                                    </td>
                                                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                                        <span style={{ padding: '4px 12px', borderRadius: '20px', background: '#f1f5f9', color: '#475569', fontSize: '13px', fontWeight: 700 }}>
                                                            {book.totalSold}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                                        <span style={{ fontSize: '14px', fontWeight: 800, color: '#059669', whiteSpace: 'nowrap' }}>
                                                            Rs. {book.revenue.toLocaleString()}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Order Status Distribution */}
                            <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e8eaf0', boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(225,113,28,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <PieChart size={16} style={{ color: '#e1711c' }} />
                                    </div>
                                    <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#111827', margin: 0 }}>Orders by Status</h3>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {ordersByStatus.length === 0 ? (
                                        <p style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', fontSize: '13px', fontWeight: 500 }}>No order status breakdown</p>
                                    ) : ordersByStatus.map((status: any) => {
                                        const pct = Math.round((status.count / maxStatusCount) * 100)
                                        const color = status._id === 'delivered' ? '#10b981' : status._id === 'cancelled' ? '#ef4444' : '#e1711c'
                                        return (
                                            <div key={status._id} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#475569', textTransform: 'capitalize' }}>{status._id}</span>
                                                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#111827' }}>{status.count} <span style={{ color: '#94a3b8', fontWeight: 500 }}>orders</span></span>
                                                </div>
                                                <div style={{ width: '100%', height: '8px', borderRadius: '4px', background: '#f1f5f9', overflow: 'hidden' }}>
                                                    <div style={{ height: '100%', borderRadius: '4px', background: color, width: `${pct}%`, transition: 'width 0.5s ease' }} />
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Bottom Section: Payment Methods */}
                        <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e8eaf0', boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(225,113,28,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <CreditCard size={16} style={{ color: '#e1711c' }} />
                                </div>
                                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#111827', margin: 0 }}>Revenue by Payment Methods</h3>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
                                {paymentMethods.length === 0 ? (
                                    <p style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', fontSize: '13px', fontWeight: 500, gridColumn: '1 / -1' }}>No payment method data</p>
                                ) : paymentMethods.map((pm: any) => {
                                    const pct = Math.round((pm.total / maxPaymentTotal) * 100)
                                    return (
                                        <div key={pm._id} style={{ padding: '20px', borderRadius: '16px', background: '#f8f9fb', border: '1px solid #e8eaf0', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'all 0.2s', cursor: 'default' }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#fff'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)' }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#f8f9fb'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <div>
                                                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Method</span>
                                                    <p style={{ fontSize: '15px', fontWeight: 800, color: '#111827', marginTop: '2px' }}>{pm._id === 'cod' ? 'Cash on Delivery (COD)' : pm._id}</p>
                                                </div>
                                                <span style={{ padding: '4px 10px', borderRadius: '10px', background: 'rgba(225,113,28,0.1)', color: '#e1711c', fontSize: '12px', fontWeight: 800 }}>
                                                    {pm.count} orders
                                                </span>
                                            </div>
                                            <div style={{ marginTop: '8px' }}>
                                                <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Total Generated</span>
                                                <p style={{ fontSize: '20px', fontWeight: 800, color: '#111827', marginTop: '2px' }}>Rs. {pm.total.toLocaleString()}</p>
                                            </div>
                                            <div style={{ width: '100%', height: '6px', borderRadius: '3px', background: '#e2e8f0', overflow: 'hidden', marginTop: '4px' }}>
                                                <div style={{ height: '100%', borderRadius: '3px', background: '#e1711c', width: `${pct}%`, transition: 'width 0.5s ease' }} />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </AdminLayout>
    )
}

export default ManageReports
