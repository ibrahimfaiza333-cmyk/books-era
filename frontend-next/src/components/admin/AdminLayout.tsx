"use client";
// src/components/admin/AdminLayout.tsx
import { useState, useRef, useEffect } from "react"
import { Menu, Bell, Search, ChevronDown } from "lucide-react"
import Sidebar from "./Sidebar"
import { useAppSelector } from "../../store/hooks"
import { useNotifications } from "../../hooks/useNotifications"

interface Props {
    children: React.ReactNode
    title:    string
}

const AdminLayout = ({ children, title }: Props) => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
    const notificationsDropdownRef = useRef<HTMLDivElement>(null)

    const { user } = useAppSelector(state => state.auth)
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications({ enabled: true })

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationsDropdownRef.current && !notificationsDropdownRef.current.contains(event.target as Node)) {
                setIsNotificationsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const initials = user?.fullName
        ? user.fullName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
        : "A"

    return (
        <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#f1f3f8' }}>
            <style>
                {`
                .admin-header {
                    padding: 0 16px;
                }
                .admin-main {
                    padding: 16px;
                }
                @media (min-width: 768px) {
                    .admin-header {
                        padding: 0 28px;
                    }
                    .admin-main {
                        padding: 28px;
                    }
                }
                `}
            </style>

            {/* Sidebar */}
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">

                {/* Top Header */}
                <header
                    className="admin-header flex-shrink-0 flex items-center justify-between bg-white"
                    style={{
                        height: '68px',
                        borderBottom: '1px solid #e8eaf0',
                        boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
                        gap: '16px',
                    }}
                >
                    {/* Left: Hamburger + Title */}
                    <div className="flex items-center" style={{ gap: '16px' }}>
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden flex items-center justify-center rounded-xl transition-all"
                            style={{ width: '38px', height: '38px', background: '#f5f6fa', color: '#64748b' }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLElement).style.background = '#e1711c'
                                ;(e.currentTarget as HTMLElement).style.color = '#fff'
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLElement).style.background = '#f5f6fa'
                                ;(e.currentTarget as HTMLElement).style.color = '#64748b'
                            }}
                        >
                            <Menu size={20} />
                        </button>

                        <div>
                            <h1
                                className="font-extrabold leading-none"
                                style={{ fontSize: '17px', color: '#111827' }}
                            >
                                {title}
                            </h1>
                            <p className="text-xs mt-0.5 font-medium hidden sm:block" style={{ color: '#94a3b8' }}>
                                Suleman Books · Admin Dashboard
                            </p>
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center" style={{ gap: '10px' }}>

                        {/* Notification Bell */}
                        <div className="relative flex items-center h-full" ref={notificationsDropdownRef}>
                            <button
                                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                className={`relative flex items-center justify-center rounded-xl transition-all ${isNotificationsOpen ? 'bg-[#fff4ec] text-[#e1711c]' : ''}`}
                                style={{ 
                                    width: '40px', height: '40px', 
                                    background: isNotificationsOpen ? '#fff4ec' : '#f5f6fa', 
                                    color: isNotificationsOpen ? '#e1711c' : '#64748b' 
                                }}
                                onMouseEnter={e => {
                                    if (!isNotificationsOpen) {
                                        (e.currentTarget as HTMLElement).style.background = '#fff4ec'
                                        ;(e.currentTarget as HTMLElement).style.color = '#e1711c'
                                    }
                                }}
                                onMouseLeave={e => {
                                    if (!isNotificationsOpen) {
                                        (e.currentTarget as HTMLElement).style.background = '#f5f6fa'
                                        ;(e.currentTarget as HTMLElement).style.color = '#64748b'
                                    }
                                }}
                            >
                                <Bell size={18} />
                                {unreadCount > 0 && (
                                    <span
                                        className="absolute rounded-full ring-2 ring-white flex items-center justify-center text-[9px] font-bold text-white"
                                        style={{ top: '6px', right: '6px', width: '14px', height: '14px', backgroundColor: '#e1711c' }}
                                    >
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* Dropdown Menu */}
                            <div
                                className={`absolute right-0 transform transition-all duration-200 w-[300px] sm:w-[350px] ${isNotificationsOpen ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-2'}`}
                                style={{ zIndex: 9999, top: 'calc(100% + 12px)' }}
                            >
                                {/* Arrow pointer */}
                                <div className="absolute right-4 -top-2 w-4 h-4 bg-white border-l border-t border-gray-200 rotate-45" style={{ zIndex: 1 }} />

                                <div className="relative bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col" style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.15)', zIndex: 2 }}>
                                    {/* Header */}
                                    <div style={{ background: '#f8fafc', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
                                        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Notifications</h3>
                                        {unreadCount > 0 && (
                                            <button 
                                                onClick={markAllAsRead}
                                                style={{ fontSize: '12px', color: '#e1711c', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
                                                className="hover:text-orange-400 transition-colors"
                                            >
                                                Mark all as read
                                            </button>
                                        )}
                                    </div>

                                    {/* Notifications List */}
                                    <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                                        {notifications.length > 0 ? (
                                            notifications.map((notif: any) => (
                                                <div 
                                                    key={notif._id}
                                                    onClick={() => {
                                                        if (!notif.isRead) markAsRead(notif._id);
                                                    }}
                                                    style={{ 
                                                        padding: '14px 20px', 
                                                        borderBottom: '1px solid #f1f5f9',
                                                        backgroundColor: notif.isRead ? '#ffffff' : '#f8fafc',
                                                        cursor: notif.isRead ? 'default' : 'pointer',
                                                        display: 'flex',
                                                        gap: '12px',
                                                        transition: 'background-color 0.2s'
                                                    }}
                                                    className={!notif.isRead ? "hover:bg-gray-50" : ""}
                                                >
                                                    <div style={{ 
                                                        width: '8px', 
                                                        height: '8px', 
                                                        borderRadius: '50%', 
                                                        backgroundColor: notif.isRead ? 'transparent' : '#e1711c',
                                                        marginTop: '6px',
                                                        flexShrink: 0
                                                    }} />
                                                    <div>
                                                        <p style={{ margin: 0, fontSize: '13.5px', color: '#334155', lineHeight: 1.5 }}>
                                                            {notif.message}
                                                        </p>
                                                        <span style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px', display: 'block' }}>
                                                            {new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div style={{ padding: '30px 20px', textAlign: 'center' }}>
                                                <div style={{ 
                                                    width: '48px', height: '48px', borderRadius: '50%', 
                                                    backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    margin: '0 auto 12px'
                                                }}>
                                                    <Bell size={24} color="#94a3b8" />
                                                </div>
                                                <p style={{ margin: 0, color: '#64748b', fontSize: '14px', fontWeight: 500 }}>No notifications yet</p>
                                                <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '13px' }}>When you get notifications, they'll show up here.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="hidden sm:block" style={{ width: '1px', height: '28px', background: '#e8eaf0' }} />

                        {/* User Profile */}
                        <div
                            className="flex items-center rounded-xl cursor-pointer transition-all"
                            style={{ gap: '10px', padding: '6px 12px 6px 6px', background: '#f5f6fa' }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#edeef2'}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#f5f6fa'}
                        >
                            {/* Avatar */}
                            <div
                                className="flex items-center justify-center rounded-xl flex-shrink-0"
                                style={{
                                    width: '34px', height: '34px',
                                    background: 'linear-gradient(135deg, #e1711c 0%, #ff8a3d 100%)',
                                    color: '#fff',
                                    fontSize: '13px',
                                    fontWeight: 800,
                                    letterSpacing: '0.5px',
                                }}
                            >
                                {initials}
                            </div>
                            <div className="hidden md:block">
                                <p style={{ fontSize: '13px', fontWeight: 700, color: '#111827', lineHeight: 1 }}>
                                    {user?.fullName?.split(" ")[0] ?? "Admin"}
                                </p>
                                <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                                    Administrator
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="admin-main flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}

export default AdminLayout