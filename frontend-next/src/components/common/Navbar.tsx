"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
    BookOpen, Search, Bell, ShoppingCart, Menu, X, User, ChevronDown, ChevronRight, Tag
} from "lucide-react";
import { useAppSelector } from "../../store/hooks";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { APP_NAME } from "../../utils/constants";
import { useCategories } from "../../hooks/useCategories";
import { useNotifications } from "../../hooks/useNotifications";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
    const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    const profileDropdownRef = useRef<HTMLDivElement>(null);
    const categoriesDropdownRef = useRef<HTMLLIElement>(null);
    const notificationsDropdownRef = useRef<HTMLDivElement>(null);

    const { data: categories } = useCategories();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
            if (categoriesDropdownRef.current && !categoriesDropdownRef.current.contains(event.target as Node)) {
                setIsCategoriesOpen(false);
            }
            if (notificationsDropdownRef.current && !notificationsDropdownRef.current.contains(event.target as Node)) {
                setIsNotificationsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    const navigate = useRouter();
    const { logout } = useAuth();
    const { isLoggedIn, user } = useAppSelector(state => state.auth);
    const { totalItems } = useCart({ enabled: isLoggedIn });
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications({ enabled: isLoggedIn });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate.push(`/books?search=${searchQuery}`);
            setSearchQuery("");
            setIsOpen(false);
        }
    };

    const handleLogout = () => {
        logout();
        setIsOpen(false);
        setIsProfileOpen(false);
    };

    return (
        <header className="w-full sticky top-0 z-50 bg-[#131921] shadow-lg">
            {/* Main Navbar Container */}
            <div
                className="w-full h-[60px] sm:h-[70px] flex items-center justify-between max-w-[1600px] mx-auto"
                style={{ paddingLeft: '2vw', paddingRight: '2vw' }}
            >

                {/* Left Section: Logo */}
                <Link href="/" className="flex items-center shrink-0 outline-none gap-2 sm:gap-3">
                    <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-[#e1711c] transition-transform duration-300 hover:scale-110" />
                    <span className="font-bold tracking-wide text-white text-lg sm:text-2xl whitespace-nowrap">
                        {APP_NAME}
                    </span>
                </Link>

                {/* Center Section: Navigation Links */}
                <nav className="hidden lg:flex flex-1 justify-center" style={{ margin: '0 1vw' }}>
                    <ul className="flex items-center" style={{ gap: '1.5vw' }}>

                        {/* Home */}
                        <li>
                            <Link
                                href="/"
                                className="relative text-[14px] xl:text-[15px] font-semibold text-gray-300 hover:text-white transition-colors duration-300 group py-2 whitespace-nowrap"
                            >
                                Home
                                <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[#e1711c] transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100 rounded-full" />
                            </Link>
                        </li>

                        {/* All Books */}
                        <li>
                            <Link
                                href="/books"
                                className="relative text-[14px] xl:text-[15px] font-semibold text-gray-300 hover:text-white transition-colors duration-300 group py-2 whitespace-nowrap"
                            >
                                All Books
                                <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[#e1711c] transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100 rounded-full" />
                            </Link>
                        </li>

                        {/* Categories Dropdown */}
                        <li ref={categoriesDropdownRef} style={{ position: 'relative' }}>
                            <button
                                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                                className="relative text-[14px] xl:text-[15px] font-semibold text-gray-300 hover:text-white transition-colors duration-300 py-2 whitespace-nowrap flex items-center gap-1 outline-none"
                            >
                                Categories
                                <ChevronDown
                                    size={15}
                                    className={`transition-transform duration-300 ${isCategoriesOpen ? 'rotate-180 text-[#e1711c]' : ''}`}
                                />
                            </button>

                            {/* Mega Dropdown */}
                            <div
                                style={{
                                    position: 'absolute',
                                    top: 'calc(100% + 16px)',
                                    left: '50%',
                                    width: '520px',
                                    zIndex: 9999,
                                    opacity: isCategoriesOpen ? 1 : 0,
                                    pointerEvents: isCategoriesOpen ? 'auto' : 'none',
                                    transition: 'opacity 0.2s ease, transform 0.2s ease',
                                    transform: isCategoriesOpen
                                        ? 'translateX(-50%) translateY(0)'
                                        : 'translateX(-50%) translateY(-8px)',
                                }}
                            >
                                {/* Arrow */}
                                <div style={{
                                    position: 'absolute',
                                    top: -8,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: 16,
                                    height: 16,
                                    background: '#1e2530',
                                    borderLeft: '1px solid rgba(255,255,255,0.08)',
                                    borderTop: '1px solid rgba(255,255,255,0.08)',
                                    rotate: '45deg',
                                    zIndex: 1,
                                }} />

                                {/* Dropdown Panel */}
                                <div style={{
                                    background: '#1a2232',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: '16px',
                                    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                                    overflow: 'hidden',
                                    position: 'relative',
                                    zIndex: 2,
                                }}>
                                    {/* Header */}
                                    <div style={{
                                        background: 'linear-gradient(135deg, #e1711c 0%, #ff8a3d 100%)',
                                        padding: '14px 20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}>
                                        <Tag size={15} color="#fff" />
                                        <span style={{ color: '#fff', fontWeight: 700, fontSize: '13px', letterSpacing: '0.05em' }}>
                                            BROWSE CATEGORIES
                                        </span>
                                    </div>

                                    {/* Categories Grid */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: '0',
                                        padding: '8px',
                                    }}>
                                        {categories && categories.length > 0 ? (
                                            categories.map((cat, index) => (
                                                <Link
                                                    key={cat._id}
                                                    href={`/books?category=${cat._id}`}
                                                    onClick={() => setIsCategoriesOpen(false)}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '10px',
                                                        padding: '12px 14px',
                                                        borderRadius: '10px',
                                                        textDecoration: 'none',
                                                        transition: 'all 0.15s ease',
                                                        color: '#cbd5e1',
                                                    }}
                                                    onMouseEnter={e => {
                                                        (e.currentTarget as HTMLElement).style.background = 'rgba(225,113,28,0.12)';
                                                        (e.currentTarget as HTMLElement).style.color = '#e1711c';
                                                    }}
                                                    onMouseLeave={e => {
                                                        (e.currentTarget as HTMLElement).style.background = 'transparent';
                                                        (e.currentTarget as HTMLElement).style.color = '#cbd5e1';
                                                    }}
                                                >
                                                    {/* Category image or icon */}
                                                    <div style={{
                                                        width: '36px',
                                                        height: '36px',
                                                        borderRadius: '8px',
                                                        background: 'rgba(225,113,28,0.15)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        flexShrink: 0,
                                                        overflow: 'hidden',
                                                        border: '1px solid rgba(225,113,28,0.2)',
                                                    }}>
                                                        {cat.image ? (
                                                            <img
                                                                src={cat.image}
                                                                alt={cat.name}
                                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                            />
                                                        ) : (
                                                            <BookOpen size={16} color="#e1711c" />
                                                        )}
                                                    </div>
                                                    <span style={{ fontSize: '13.5px', fontWeight: 600, lineHeight: 1.3 }}>
                                                        {cat.name}
                                                    </span>
                                                    <ChevronRight size={13} style={{ marginLeft: 'auto', flexShrink: 0, opacity: 0.5 }} />
                                                </Link>
                                            ))
                                        ) : (
                                            <div style={{ gridColumn: '1 / -1', padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                                                Loading categories...
                                            </div>
                                        )}
                                    </div>

                                    {/* Footer Link */}
                                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '10px 16px' }}>
                                        <Link
                                            href="/books"
                                            onClick={() => setIsCategoriesOpen(false)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '6px',
                                                color: '#e1711c',
                                                fontSize: '13px',
                                                fontWeight: 700,
                                                textDecoration: 'none',
                                                padding: '6px',
                                                borderRadius: '8px',
                                                transition: 'background 0.15s',
                                            }}
                                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(225,113,28,0.08)'}
                                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                                        >
                                            View All Books
                                            <ChevronRight size={14} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </nav>

                {/* Right Section: Search & Actions */}
                <div className="flex items-center shrink-0" style={{ gap: 'clamp(6px, 1.2vw, 20px)' }}>

                    {/* Search Bar */}
                    <form
                        onSubmit={handleSearch}
                        className="hidden lg:flex items-center bg-white rounded-md shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-[#e1711c] transition-all duration-300"
                        style={{ width: '22vw', maxWidth: '280px', height: '40px' }}
                    >
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for books..."
                            className="bg-transparent text-gray-800 outline-none text-[13px] xl:text-[14px] flex-1 font-medium placeholder-gray-400"
                            style={{ paddingLeft: '1vw', width: '100%' }}
                        />
                        <button type="submit" className="h-full bg-[#e1711c] hover:bg-[#c85f10] flex justify-center items-center transition-colors" style={{ width: '3.5vw', maxWidth: '50px', minWidth: '40px' }}>
                            <Search size={20} className="text-gray-900" />
                        </button>
                    </form>

                    {/* Notification Icon & Dropdown */}
                    {isLoggedIn && (
                        <div className="relative flex items-center h-full" ref={notificationsDropdownRef} style={{ overflow: 'visible' }}>
                            <button
                                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                className={`relative flex items-center justify-center rounded-full transition-all duration-200 outline-none p-1.5 sm:p-2 ${isNotificationsOpen ? 'text-white bg-white/10' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
                            >
                                <Bell className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
                                {unreadCount > 0 && (
                                    <span className="absolute bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-[#131921] -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5">
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
                                    <div style={{ background: '#131921', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', margin: 0 }}>Notifications</h3>
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
                    )}

                    {/* User Auth & Dropdown */}
                    {isLoggedIn ? (
                        <div className="relative flex items-center h-full" ref={profileDropdownRef} style={{ overflow: 'visible' }}>
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className={`flex items-center justify-center rounded-full transition-all duration-200 outline-none p-1.5 sm:p-2 ${isProfileOpen ? 'text-white bg-white/10' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
                            >
                                <User className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
                                <ChevronDown className={`hidden sm:block w-4 h-4 transition-transform duration-300 ml-1 ${isProfileOpen ? 'rotate-180 text-white' : 'text-gray-400'}`} />
                            </button>

                            {/* Dropdown Menu */}
                            <div
                                className={`absolute right-0 transform transition-all duration-200 w-56 sm:w-64 ${isProfileOpen ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-2'}`}
                                style={{ zIndex: 9999, top: 'calc(100% + 12px)' }}
                            >
                                {/* Arrow pointer */}
                                <div className="absolute right-4 -top-2 w-4 h-4 bg-white border-l border-t border-gray-200 rotate-45" style={{ zIndex: 1 }} />

                                <div className="relative bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col" style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.15)', zIndex: 2 }}>
                                    {/* Header */}
                                    <div style={{ background: '#131921', padding: '16px 20px' }}>
                                        <p style={{ fontSize: '11px', color: '#e1711c', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Signed in as</p>
                                        <p style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }} className="truncate">{user?.fullName}</p>
                                    </div>

                                    {/* Links */}
                                    <div style={{ padding: '12px' }}>
                                        {[
                                            { href: '/profile', label: 'Your Account', emoji: '👤' },
                                            { href: '/orders', label: 'Your Orders', emoji: '📦' },
                                            { href: '/wishlist', label: 'Your Wishlist', emoji: '❤️' },
                                        ].map(item => (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() => setIsProfileOpen(false)}
                                                className="flex items-center justify-between font-semibold text-gray-700 hover:text-[#e77600] transition-all duration-200 active:scale-[0.98]"
                                                style={{
                                                    padding: '12px 14px',
                                                    backgroundColor: '#f8fafc',
                                                    borderRadius: '10px',
                                                    border: '1px solid #e2e8f0',
                                                    marginBottom: '8px',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                <span>{item.emoji} &nbsp;{item.label}</span>
                                                <ChevronRight size={16} className="text-gray-400" />
                                            </Link>
                                        ))}

                                        {user?.role === "admin" && (
                                            <Link
                                                href="/admin"
                                                onClick={() => setIsProfileOpen(false)}
                                                className="flex items-center justify-between font-semibold text-orange-600 hover:text-orange-700 transition-all duration-200 active:scale-[0.98]"
                                                style={{
                                                    padding: '12px 14px',
                                                    backgroundColor: '#fff7ed',
                                                    borderRadius: '10px',
                                                    border: '1px solid #fed7aa',
                                                    marginBottom: '8px',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                <span>⚙️ &nbsp;Admin Panel</span>
                                                <ChevronRight size={16} className="text-orange-400" />
                                            </Link>
                                        )}

                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center justify-between font-semibold text-red-600 hover:text-red-700 transition-all duration-200 active:scale-[0.98]"
                                            style={{
                                                padding: '12px 14px',
                                                backgroundColor: '#fff5f5',
                                                borderRadius: '10px',
                                                border: '1px solid #fecaca',
                                                fontSize: '14px'
                                            }}
                                        >
                                            <span>🚪 &nbsp;Sign Out</span>
                                            <ChevronRight size={16} className="text-red-400" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="font-semibold text-white bg-gradient-to-r from-[#e1711c] to-[#f08a32] hover:from-[#c85f10] hover:to-[#e1711c] rounded-full transition-all duration-300 active:scale-95 shadow-[0_4px_12px_rgba(225,113,28,0.3)] hover:shadow-[0_6px_18px_rgba(225,113,28,0.5)] ml-2 border border-[#f08a32]/40 hover:border-white/50"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '10px 26px',
                                fontSize: '15px',
                                lineHeight: '1',
                                whiteSpace: 'nowrap',
                                minHeight: '42px',
                                textDecoration: 'none'
                            }}
                        >
                            Sign In
                        </Link>
                    )}

                    {/* Cart Icon */}
                    <Link
                        href="/cart"
                        className="relative text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200 outline-none active:scale-95 flex items-center p-1.5 sm:p-2"
                    >
                        <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
                        {totalItems > 0 && (
                            <span className="absolute bg-[#e1711c] text-[#131921] text-[10px] sm:text-[12px] font-extrabold rounded-full flex items-center justify-center ring-2 ring-[#131921] -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5">
                                {totalItems}
                            </span>
                        )}
                    </Link>

                    {/* Mobile Hamburger Menu Icon */}
                    <button
                        className="lg:hidden text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors active:scale-95 p-1.5 sm:p-2 ml-0 sm:ml-1"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X className="w-6 h-6 sm:w-7 sm:h-7" /> : <Menu className="w-6 h-6 sm:w-7 sm:h-7" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Sidebar (Drawer) */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm lg:hidden transition-opacity"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Drawer */}
                    <div className="fixed top-0 left-0 h-full bg-white z-[70] shadow-2xl overflow-y-auto transform transition-transform duration-300 lg:hidden w-[85%] max-w-sm flex flex-col">

                        {/* Drawer Header */}
                        <div className="flex items-center justify-between bg-[#131921] px-5 h-[70px]">
                            <div className="flex items-center gap-2">
                                <BookOpen className="w-6 h-6 text-[#e1711c]" />
                                <span className="font-bold text-xl text-white tracking-wide">
                                    {APP_NAME}
                                </span>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-300 hover:text-white outline-none transition-transform hover:rotate-90 duration-300"
                            >
                                <X size={26} />
                            </button>
                        </div>

                        {/* Drawer Content - Scrollable */}
                        <div className="flex-1 overflow-y-auto" style={{ paddingTop: '24px', paddingBottom: '24px' }}>

                            {/* Mobile Search */}
                            <div className="lg:hidden" style={{ paddingLeft: '20px', paddingRight: '20px', marginBottom: '32px' }}>
                                <form
                                    onSubmit={handleSearch}
                                    className="flex items-center bg-white border border-gray-300 rounded-md shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-[#e1711c] focus-within:border-transparent transition-all duration-300"
                                    style={{ height: '48px' }}
                                >
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search for books..."
                                        className="flex-1 text-gray-800 outline-none text-[15px] font-medium placeholder-gray-400"
                                        style={{ paddingLeft: '20px', width: '100%' }}
                                    />
                                    <button type="submit" className="bg-[#e1711c] hover:bg-[#c85f10] h-full flex justify-center items-center transition-colors" style={{ width: '50px', minWidth: '50px' }}>
                                        <Search size={20} className="text-gray-900" />
                                    </button>
                                </form>
                            </div>

                            {/* Navigation Links */}
                            <div style={{ paddingLeft: '20px', paddingRight: '20px', marginBottom: '16px' }}>
                                <h3 className="font-bold text-gray-400 uppercase" style={{ fontSize: '13px', letterSpacing: '1px', marginBottom: '16px' }}>Menu</h3>
                                <ul className="flex flex-col" style={{ gap: '10px' }}>
                                    {[
                                        { href: '/', label: 'Home' },
                                        { href: '/books', label: 'All Books' },
                                    ].map((link) => (
                                        <li key={link.href}>
                                            <Link
                                                href={link.href}
                                                onClick={() => setIsOpen(false)}
                                                className="flex items-center justify-between font-semibold text-gray-700 hover:text-[#c85f10] hover:border-[#e1711c] transition-all duration-300 active:scale-[0.98]"
                                                style={{
                                                    padding: '14px 16px',
                                                    backgroundColor: '#f8fafc',
                                                    borderRadius: '10px',
                                                    border: '1px solid #e2e8f0',
                                                    boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                                                }}
                                            >
                                                <span style={{ fontSize: '15px' }}>{link.label}</span>
                                                <ChevronRight size={18} className="text-gray-400" />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Mobile Categories */}
                            <div style={{ paddingLeft: '20px', paddingRight: '20px', marginBottom: '32px' }}>
                                <button
                                    onClick={() => setIsMobileCategoriesOpen(!isMobileCategoriesOpen)}
                                    className="w-full flex items-center justify-between font-bold text-gray-400 uppercase transition-colors"
                                    style={{ fontSize: '13px', letterSpacing: '1px', marginBottom: '16px', background: 'none', border: 'none', cursor: 'pointer' }}
                                >
                                    <span>Categories</span>
                                    <ChevronDown
                                        size={16}
                                        className={`text-gray-400 transition-transform duration-300 ${isMobileCategoriesOpen ? 'rotate-180 text-[#e1711c]' : ''}`}
                                    />
                                </button>

                                {isMobileCategoriesOpen && (
                                    <ul className="flex flex-col" style={{ gap: '8px' }}>
                                        {categories && categories.length > 0 ? (
                                            categories.map((cat) => (
                                                <li key={cat._id}>
                                                    <Link
                                                        href={`/books?category=${cat._id}`}
                                                        onClick={() => setIsOpen(false)}
                                                        className="flex items-center gap-3 font-semibold text-gray-700 hover:text-[#e1711c] transition-all duration-300 active:scale-[0.98]"
                                                        style={{
                                                            padding: '12px 14px',
                                                            backgroundColor: '#f8fafc',
                                                            borderRadius: '10px',
                                                            border: '1px solid #e2e8f0',
                                                        }}
                                                    >
                                                        <div style={{
                                                            width: '32px',
                                                            height: '32px',
                                                            borderRadius: '8px',
                                                            background: 'rgba(225,113,28,0.1)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            flexShrink: 0,
                                                            overflow: 'hidden',
                                                        }}>
                                                            {cat.image ? (
                                                                <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                            ) : (
                                                                <BookOpen size={14} color="#e1711c" />
                                                            )}
                                                        </div>
                                                        <span style={{ fontSize: '14px', flex: 1 }}>{cat.name}</span>
                                                        <ChevronRight size={16} className="text-gray-400" />
                                                    </Link>
                                                </li>
                                            ))
                                        ) : (
                                            <li style={{ padding: '16px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                                                Loading...
                                            </li>
                                        )}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </header>
    );
};

export default Navbar;
