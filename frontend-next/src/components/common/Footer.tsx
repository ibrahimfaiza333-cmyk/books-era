"use client";
import Link from "next/link";
import { BookOpen, MapPin, Phone, Mail, ArrowRight } from "lucide-react"
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa"
import { APP_NAME, EMAIL_ID, PHONE_NO, ADDRESS } from "../../utils/constants"
import { useCategories } from "../../hooks/useCategories"

const Footer = () => {
    const { data: categories } = useCategories()

    return (
        <footer className="w-full m-auto">

            {/* ── Main Footer ── */}
            <div style={{
                background: "linear-gradient(160deg, #1c2632 0%, #111820 100%)",
                color: "#cbd5e1",
                position: "relative",
                overflow: "hidden"
            }}>
                {/* Decorative blobs */}
                <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 65%)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", bottom: -80, left: -80, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 65%)", pointerEvents: "none" }} />

                <div style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 24px 60px", position: "relative" }}>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "1.4fr 1fr 1fr 1.2fr",
                        gap: 40
                    }} className="footer-grid">

                        {/* ── Column 1 — Brand ── */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
                                <div style={{
                                    width: 42, height: 42, borderRadius: 12,
                                    background: "linear-gradient(135deg, #f97316, #fb923c)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    boxShadow: "0 4px 14px rgba(249,115,22,0.4)"
                                }}>
                                    <BookOpen size={22} color="#fff" />
                                </div>
                                <span style={{ color: "#fff", fontWeight: 800, fontSize: 20, letterSpacing: "-0.3px" }}>
                                    {APP_NAME}
                                </span>
                            </Link>

                            <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.8, margin: 0 }}>
                                Your trusted source for quality books.
                                Best prices on Academic, Cambridge, Sindh Board,
                                Pre-School books and more.
                            </p>

                            {/* Social Icons */}
                            <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
                                {[
                                    { icon: <FaFacebook size={16} />, href: "#" },
                                    { icon: <FaInstagram size={16} />, href: "#" },
                                    { icon: <FaTwitter size={16} />, href: "#" },
                                ].map((s, i) => (
                                    <a
                                        key={i}
                                        href={s.href}
                                        style={{
                                            width: 38, height: 38, borderRadius: 10,
                                            background: "rgba(255,255,255,0.06)",
                                            border: "1px solid rgba(255,255,255,0.1)",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            color: "#94a3b8", textDecoration: "none",
                                            transition: "all .2s ease"
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.background = "#f97316"
                                            e.currentTarget.style.borderColor = "#f97316"
                                            e.currentTarget.style.color = "#fff"
                                            e.currentTarget.style.transform = "translateY(-2px)"
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.background = "rgba(255,255,255,0.06)"
                                            e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"
                                            e.currentTarget.style.color = "#94a3b8"
                                            e.currentTarget.style.transform = "translateY(0)"
                                        }}
                                    >
                                        {s.icon}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* ── Column 2 — Quick Links ── */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                            <div>
                                <h3 style={{ margin: 0, color: "#fff", fontWeight: 700, fontSize: 15, letterSpacing: "0.01em" }}>
                                    Quick Links
                                </h3>
                                <div style={{ width: 28, height: 3, borderRadius: 99, background: "linear-gradient(90deg, #f97316, #fb923c)", marginTop: 10 }} />
                            </div>
                            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                                {/* Static links */}
                                {[
                                    { to: "/",      label: "Home"      },
                                    { to: "/books", label: "All Books" },
                                ].map(link => (
                                    <li key={link.to}>
                                        <Link
                                            href={link.to}
                                            style={{
                                                color: "#94a3b8", fontSize: 14, textDecoration: "none",
                                                display: "inline-flex", alignItems: "center", gap: 6,
                                                transition: "all .2s ease"
                                            }}
                                            onMouseEnter={e => {
                                                e.currentTarget.style.color = "#f97316"
                                                e.currentTarget.style.paddingLeft = "4px"
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.color = "#94a3b8"
                                                e.currentTarget.style.paddingLeft = "0px"
                                            }}
                                        >
                                            <ArrowRight size={12} />
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                                {/* Dynamic category links — same _id routing as Browse by Category */}
                                {categories?.map(cat => (
                                    <li key={cat._id}>
                                        <Link
                                            href={`/books?category=${cat._id}`}
                                            style={{
                                                color: "#94a3b8", fontSize: 14, textDecoration: "none",
                                                display: "inline-flex", alignItems: "center", gap: 6,
                                                transition: "all .2s ease"
                                            }}
                                            onMouseEnter={e => {
                                                e.currentTarget.style.color = "#f97316"
                                                e.currentTarget.style.paddingLeft = "4px"
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.color = "#94a3b8"
                                                e.currentTarget.style.paddingLeft = "0px"
                                            }}
                                        >
                                            <ArrowRight size={12} />
                                            {cat.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* ── Column 3 — Customer Service ── */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                            <div>
                                <h3 style={{ margin: 0, color: "#fff", fontWeight: 700, fontSize: 15, letterSpacing: "0.01em" }}>
                                    Customer Service
                                </h3>
                                <div style={{ width: 28, height: 3, borderRadius: 99, background: "linear-gradient(90deg, #f97316, #fb923c)", marginTop: 10 }} />
                            </div>
                            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                                {[
                                    { to: "/profile",  label: "My Account"  },
                                    { to: "/orders",   label: "My Orders"   },
                                    { to: "/wishlist", label: "My Wishlist"  },
                                    { to: "/cart",     label: "My Cart"      },
                                ].map(link => (
                                    <li key={link.to}>
                                        <Link
                                            href={link.to}
                                            style={{
                                                color: "#94a3b8", fontSize: 14, textDecoration: "none",
                                                display: "inline-flex", alignItems: "center", gap: 6,
                                                transition: "all .2s ease"
                                            }}
                                            onMouseEnter={e => {
                                                e.currentTarget.style.color = "#f97316"
                                                e.currentTarget.style.paddingLeft = "4px"
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.color = "#94a3b8"
                                                e.currentTarget.style.paddingLeft = "0px"
                                            }}
                                        >
                                            <ArrowRight size={12} />
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* ── Column 4 — Contact ── */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                            <div>
                                <h3 style={{ margin: 0, color: "#fff", fontWeight: 700, fontSize: 15, letterSpacing: "0.01em" }}>
                                    Contact Info
                                </h3>
                                <div style={{ width: 28, height: 3, borderRadius: 99, background: "linear-gradient(90deg, #f97316, #fb923c)", marginTop: 10 }} />
                            </div>
                            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 16 }}>
                                <li style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                                    <div style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(249,115,22,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                        <MapPin size={15} color="#f97316" />
                                    </div>
                                    <span style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.6, paddingTop: 4 }}>
                                        {ADDRESS}
                                    </span>
                                </li>
                                <li style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <div style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(249,115,22,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                        <Phone size={15} color="#f97316" />
                                    </div>
                                    <a
                                        href={PHONE_NO}
                                        style={{ color: "#94a3b8", fontSize: 13, textDecoration: "none", transition: "color .2s" }}
                                        onMouseEnter={e => e.currentTarget.style.color = "#f97316"}
                                        onMouseLeave={e => e.currentTarget.style.color = "#94a3b8"}
                                    >
                                        {PHONE_NO}
                                    </a>
                                </li>
                                <li style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <div style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(249,115,22,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                        <Mail size={15} color="#f97316" />
                                    </div>
                                    <a
                                        href={EMAIL_ID}
                                        style={{ color: "#94a3b8", fontSize: 13, textDecoration: "none", transition: "color .2s" }}
                                        onMouseEnter={e => e.currentTarget.style.color = "#f97316"}
                                        onMouseLeave={e => e.currentTarget.style.color = "#94a3b8"}
                                    >
                                        {EMAIL_ID}
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* ── Bottom Bar ── */}
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                    <div style={{
                        maxWidth: 1200, margin: "0 auto",
                        padding: "20px 24px",
                        display: "flex", flexWrap: "wrap",
                        alignItems: "center", justifyContent: "space-between",
                        gap: 12
                    }}>
                        <p style={{ margin: 0, color: "#475569", fontSize: 13 }}>
                            © 2025 <span style={{ color: "#f97316", fontWeight: 600 }}>{APP_NAME}</span>. All rights reserved.
                        </p>
                        <div style={{ display: "flex", gap: 20 }}>
                            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(label => (
                                <Link
                                    key={label}
                                    href="#"
                                    style={{ color: "#475569", fontSize: 13, textDecoration: "none", transition: "color .2s" }}
                                    onMouseEnter={e => e.currentTarget.style.color = "#f97316"}
                                    onMouseLeave={e => e.currentTarget.style.color = "#475569"}
                                >
                                    {label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Responsive styles */}
                <style>{`
                    .footer-grid {
                        grid-template-columns: 1.4fr 1fr 1fr 1.2fr;
                    }
                    @media (max-width: 900px) {
                        .footer-grid { grid-template-columns: 1fr 1fr !important; }
                    }
                    @media (max-width: 560px) {
                        .footer-grid { grid-template-columns: 1fr !important; }
                    }
                `}</style>
            </div>
        </footer>
    )
}

export default Footer