"use client";
// src/pages/admin/ManageUsers.tsx
import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Search, Ban, Loader2, Trash2, Users } from "lucide-react"
import { getAdminUsers, banUser, deleteUser, type AdminUser } from "../../api/admin.api"
import { toastApiError } from "../../lib/api-error"
import { queryKeys } from "../../lib/query-keys"
import AdminLayout from "../../components/admin/AdminLayout"
import { toast } from "react-toastify";

const ManageUsers = () => {
    const queryClient  = useQueryClient()
    const [search,     setSearch]     = useState("")
    const [page,       setPage]       = useState(1)
    const [banningId,  setBanningId]  = useState<string | null>(null)
    const [deletingId, setDeletingId] = useState<string | null>(null)

    const { data, isLoading } = useQuery({
        queryKey: queryKeys.adminUsers(search, page),
        queryFn: () => getAdminUsers(page, 10, search),
    })

    const users:       AdminUser[] = data?.users      || []
    const total:       number      = data?.total      || 0
    const totalPages:  number      = data?.totalPages || 1

    const handleBan = async (userId: string) => {
        try {
            setBanningId(userId)
            const result = await banUser(userId)
            queryClient.invalidateQueries({ queryKey: queryKeys.adminUsersRoot })
            toast.success(result.message || "User status updated!")
        } catch (error: unknown) {
            toastApiError(error, "Failed!")
        } finally {
            setBanningId(null)
        }
    }

    const handleDelete = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this user?")) return
        try {
            setDeletingId(userId)
            await deleteUser(userId)
            queryClient.invalidateQueries({ queryKey: queryKeys.adminUsersRoot })
            toast.success("User deleted!")
        } catch (error: unknown) {
            toastApiError(error, "Failed!")
        } finally {
            setDeletingId(null)
        }
    }

    return (
        <>
            <AdminLayout title="Manage Users">
                <style>
                    {`
                    .users-container {
                        display: flex;
                        flex-direction: column;
                        gap: 16px;
                    }
                    .users-header {
                        display: flex;
                        flex-direction: column;
                        gap: 12px;
                    }
                    .users-search-form {
                        width: 100%;
                    }
                    .users-total {
                        width: 100%;
                        justify-content: center;
                    }
                    .users-pagination {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 12px;
                    }
                    @media (min-width: 640px) {
                        .users-container {
                            gap: 24px;
                        }
                        .users-header {
                            flex-direction: row;
                            align-items: center;
                            justify-content: space-between;
                        }
                        .users-search-form {
                            max-width: 300px;
                        }
                        .users-total {
                            width: auto;
                        }
                        .users-pagination {
                            flex-direction: row;
                            justify-content: space-between;
                        }
                    }
                    `}
                </style>
                <div className="users-container">

                    {/* Header */}
                    <div className="users-header">
                        <form
                            onSubmit={(e) => { e.preventDefault(); setPage(1) }}
                            className="users-search-form flex items-center bg-white rounded-xl"
                            style={{ border: '1px solid #e8eaf0', padding: '10px 16px', gap: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                        >
                            <Search size={15} style={{ color: '#94a3b8', flexShrink: 0 }} />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                                placeholder="Search name, email, phone..."
                                className="outline-none bg-transparent"
                                style={{ fontSize: '13px', flex: 1, color: '#374151' }}
                            />
                        </form>

                        <div className="users-total" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '10px', background: '#fff', border: '1px solid #e8eaf0' }}>
                            <Users size={14} color="#e1711c" />
                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>
                                Total: <strong style={{ color: '#111827' }}>{total}</strong> users
                            </span>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid #e8eaf0', boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                                <thead>
                                    <tr style={{ background: '#f8f9fb', borderBottom: '2px solid #eef0f5' }}>
                                        {['User', 'Phone', 'Address', 'Joined', 'Status', 'Actions'].map(col => (
                                            <th key={col} style={{ padding: '14px 20px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap' }}>
                                                {col}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={6} style={{ padding: '64px', textAlign: 'center' }}>
                                                <div className="w-9 h-9 border-4 rounded-full animate-spin mx-auto" style={{ borderColor: '#e1711c', borderTopColor: 'transparent' }} />
                                            </td>
                                        </tr>
                                    ) : users.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} style={{ padding: '64px', textAlign: 'center' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(225,113,28,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Users size={24} color="#e1711c" />
                                                    </div>
                                                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#64748b' }}>No users found</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : users.map((user) => {
                                        const initials = user.fullName?.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() || "U"
                                        return (
                                            <tr
                                                key={user._id}
                                                style={{ borderBottom: '1px solid #f3f4f6', transition: 'background 0.15s' }}
                                                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#fafafa'}
                                                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                                            >
                                                {/* User Info */}
                                                <td style={{ padding: '14px 20px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                        <div style={{
                                                            width: '38px', height: '38px', borderRadius: '12px', flexShrink: 0,
                                                            background: 'linear-gradient(135deg, #e1711c 0%, #ff8a3d 100%)',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            color: '#fff', fontSize: '13px', fontWeight: 800
                                                        }}>
                                                            {initials}
                                                        </div>
                                                        <div>
                                                            <p style={{ fontSize: '13.5px', fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>{user.fullName}</p>
                                                            <p style={{ fontSize: '11.5px', color: '#94a3b8', marginTop: '2px' }}>{user.email}</p>
                                                            <p style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '1px' }}>@{user.username}</p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Phone */}
                                                <td style={{ padding: '14px 20px', fontSize: '13px', color: '#4b5563', fontWeight: 500 }}>
                                                    {user.phone || "—"}
                                                </td>

                                                {/* Address */}
                                                <td style={{ padding: '14px 20px', fontSize: '12.5px', color: '#64748b' }}>
                                                    {user.addresses?.[0]
                                                        ? `${user.addresses[0].city}, ${user.addresses[0].province}`
                                                        : "—"
                                                    }
                                                </td>

                                                {/* Joined */}
                                                <td style={{ padding: '14px 20px', fontSize: '12.5px', color: '#64748b' }}>
                                                    {new Date(user.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
                                                </td>

                                                {/* Status */}
                                                <td style={{ padding: '14px 20px' }}>
                                                    <span style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                                                        fontSize: '11.5px', fontWeight: 700, padding: '4px 10px', borderRadius: '20px',
                                                        background: user.isActive ? '#dcfce7' : '#fee2e2',
                                                        color: user.isActive ? '#15803d' : '#b91c1c',
                                                    }}>
                                                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: user.isActive ? '#22c55e' : '#ef4444' }} />
                                                        {user.isActive ? "Active" : "Banned"}
                                                    </span>
                                                </td>

                                                {/* Actions */}
                                                <td style={{ padding: '14px 20px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        {/* Ban/Unban */}
                                                        <button
                                                            onClick={() => handleBan(user._id)}
                                                            disabled={banningId === user._id}
                                                            title={user.isActive ? "Ban User" : "Unban User"}
                                                            style={{
                                                                display: 'flex', alignItems: 'center', gap: '5px',
                                                                padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                                                                border: `1px solid ${user.isActive ? '#fecaca' : '#bbf7d0'}`,
                                                                background: user.isActive ? '#fee2e2' : '#dcfce7',
                                                                color: user.isActive ? '#b91c1c' : '#15803d',
                                                                cursor: 'pointer', opacity: banningId === user._id ? 0.6 : 1,
                                                                transition: 'all 0.15s'
                                                            }}
                                                        >
                                                            {banningId === user._id ? <Loader2 size={12} className="animate-spin" /> : <Ban size={12} />}
                                                            {user.isActive ? "Ban" : "Unban"}
                                                        </button>

                                                        {/* Delete */}
                                                        <button
                                                            onClick={() => handleDelete(user._id)}
                                                            disabled={deletingId === user._id}
                                                            title="Delete User"
                                                            style={{
                                                                width: '34px', height: '34px', borderRadius: '10px',
                                                                border: '1px solid #e8eaf0', background: '#fff',
                                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                color: '#94a3b8', cursor: 'pointer', transition: 'all 0.15s',
                                                                opacity: deletingId === user._id ? 0.5 : 1
                                                            }}
                                                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#fee2e2'; (e.currentTarget as HTMLElement).style.borderColor = '#fecaca'; (e.currentTarget as HTMLElement).style.color = '#ef4444' }}
                                                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#fff'; (e.currentTarget as HTMLElement).style.borderColor = '#e8eaf0'; (e.currentTarget as HTMLElement).style.color = '#94a3b8' }}
                                                        >
                                                            {deletingId === user._id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="users-pagination" style={{ padding: '16px 24px', borderTop: '1px solid #f3f4f6' }}>
                                <p style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
                                    Page <strong style={{ color: '#111827' }}>{page}</strong> of <strong style={{ color: '#111827' }}>{totalPages}</strong>
                                </p>
                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
                                    <button
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        style={{ padding: '7px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, border: '1px solid #e8eaf0', background: '#fff', color: '#374151', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.4 : 1 }}
                                    >
                                        ← Prev
                                    </button>

                                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                        const pn = i + 1
                                        return (
                                            <button
                                                key={pn}
                                                onClick={() => setPage(pn)}
                                                style={{
                                                    width: '34px', height: '34px', borderRadius: '8px', fontSize: '13px', fontWeight: 700,
                                                    border: page === pn ? 'none' : '1px solid #e8eaf0',
                                                    background: page === pn ? 'linear-gradient(135deg, #e1711c, #ff8a3d)' : '#fff',
                                                    color: page === pn ? '#fff' : '#374151',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                {pn}
                                            </button>
                                        )
                                    })}

                                    <button
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        style={{ padding: '7px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, border: '1px solid #e8eaf0', background: '#fff', color: '#374151', cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.4 : 1 }}
                                    >
                                        Next →
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </AdminLayout>
        </>
    )
}

export default ManageUsers