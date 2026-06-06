"use client";
// src/components/admin/Sidebar.tsx
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    BookOpen,
    ShoppingBag,
    Users,
    Tag,
    BarChart2,
    X,
    ArrowLeft,
    ChevronRight,
    Ticket,
    Megaphone
} from "lucide-react"

interface Props {
    isOpen:  boolean
    onClose: () => void
}

const links = [
    { to: "/admin",            icon: LayoutDashboard, label: "Dashboard",   badge: null },
    { to: "/admin/books",      icon: BookOpen,        label: "Books",       badge: null },
    { to: "/admin/orders",     icon: ShoppingBag,     label: "Orders",      badge: null },
    { to: "/admin/users",      icon: Users,           label: "Users",       badge: null },
    { to: "/admin/categories", icon: Tag,             label: "Categories",  badge: null },
    { to: "/admin/coupons",    icon: Ticket,          label: "Coupons",     badge: null },
    { to: "/admin/reports",    icon: BarChart2,       label: "Reports",     badge: null },
    { to: "/admin/broadcast",  icon: Megaphone,       label: "Broadcast",   badge: null },
]

const Sidebar = ({ isOpen, onClose }: Props) => {
    const pathname = usePathname() ?? ""

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full z-50 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
                style={{ width: '260px', background: 'linear-gradient(180deg, #0f1923 0%, #131921 60%, #0d1117 100%)', borderRight: '1px solid rgba(255,255,255,0.06)' }}
            >
                {/* Logo Header */}
                <div className="flex items-center justify-between" style={{ padding: '24px 20px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <Link href="/admin" className="flex items-center gap-3">
                        {/* Logo mark */}
                        <div
                            className="flex items-center justify-center rounded-xl flex-shrink-0"
                            style={{
                                width: '40px', height: '40px',
                                background: 'linear-gradient(135deg, #e1711c 0%, #ff8a3d 100%)',
                                boxShadow: '0 4px 12px rgba(225,113,28,0.35)'
                            }}
                        >
                            <BookOpen size={19} color="#fff" />
                        </div>
                        <div>
                            <p className="font-extrabold text-sm leading-none text-white tracking-wide">Admin Panel</p>
                            <p className="text-xs mt-1 font-semibold" style={{ color: '#e1711c' }}>Suleman Books</p>
                        </div>
                    </Link>
                    <button
                        onClick={onClose}
                        className="lg:hidden flex items-center justify-center rounded-lg transition-all"
                        style={{ width: '30px', height: '30px', color: 'rgba(255,255,255,0.5)' }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#fff'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Menu label */}
                <div style={{ padding: '20px 20px 8px 20px' }}>
                    <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' }}>
                        Main Menu
                    </p>
                </div>

                {/* Nav Links */}
                <nav className="flex-1" style={{ padding: '4px 10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {links.map(link => {
                        const isActive = pathname === link.to || (link.to !== "/admin" && pathname.startsWith(link.to))
                        return (
                            <Link
                                key={link.to}
                                href={link.to}
                                onClick={onClose}
                                className="flex items-center transition-all duration-200"
                                style={{
                                    gap: '12px',
                                    padding: '11px 14px',
                                    borderRadius: '12px',
                                    textDecoration: 'none',
                                    background: isActive
                                        ? 'linear-gradient(135deg, #e1711c 0%, #ff8a3d 100%)'
                                        : 'transparent',
                                    color: isActive ? '#ffffff' : 'rgba(255,255,255,0.5)',
                                    boxShadow: isActive ? '0 4px 12px rgba(225,113,28,0.25)' : 'none',
                                    position: 'relative',
                                }}
                                onMouseEnter={e => {
                                    if (!isActive) {
                                        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'
                                        ;(e.currentTarget as HTMLElement).style.color = '#ffffff'
                                    }
                                }}
                                onMouseLeave={e => {
                                    if (!isActive) {
                                        (e.currentTarget as HTMLElement).style.background = 'transparent'
                                        ;(e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'
                                    }
                                }}
                            >
                                {/* Icon container */}
                                <div
                                    className="flex items-center justify-center flex-shrink-0 rounded-lg"
                                    style={{
                                        width: '32px', height: '32px',
                                        background: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)',
                                    }}
                                >
                                    <link.icon size={16} />
                                </div>

                                <span style={{ fontSize: '13.5px', fontWeight: 600, flex: 1 }}>
                                    {link.label}
                                </span>

                                {isActive && (
                                    <ChevronRight size={14} style={{ opacity: 0.7 }} />
                                )}
                            </Link>
                        )
                    })}
                </nav>

                {/* Divider */}
                <div style={{ margin: '0 16px', height: '1px', background: 'rgba(255,255,255,0.06)' }} />

                {/* Back to website */}
                <div style={{ padding: '16px 10px 20px 10px' }}>
                    <Link
                        href="/"
                        className="flex items-center transition-all duration-200"
                        style={{
                            gap: '10px',
                            padding: '11px 14px',
                            borderRadius: '12px',
                            border: '1px solid rgba(255,255,255,0.08)',
                            color: 'rgba(255,255,255,0.45)',
                            fontSize: '13px',
                            fontWeight: 600,
                            textDecoration: 'none',
                        }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(225,113,28,0.4)'
                            ;(e.currentTarget as HTMLElement).style.color = '#ffffff'
                            ;(e.currentTarget as HTMLElement).style.background = 'rgba(225,113,28,0.07)'
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'
                            ;(e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)'
                            ;(e.currentTarget as HTMLElement).style.background = 'transparent'
                        }}
                    >
                        <div className="flex items-center justify-center rounded-lg" style={{ width: '30px', height: '30px', background: 'rgba(255,255,255,0.05)' }}>
                            <ArrowLeft size={14} />
                        </div>
                        Back to Website
                    </Link>
                </div>
            </aside>
        </>
    )
}

export default Sidebar