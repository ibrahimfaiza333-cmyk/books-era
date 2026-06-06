"use client";
import { useState } from "react"
import { useForm } from "react-hook-form"
import type { LucideIcon } from "lucide-react"
import {
    User, MapPin, Lock, Plus, Trash2, Loader2,
    Mail, Phone, AtSign, CheckCircle, Eye, EyeOff, Home, Shield
} from "lucide-react"
import { useProfile } from "../hooks/useProfile"
import { getApiErrorMessage } from "../lib/api-error"
import { toast } from "react-toastify";

type Tab = "profile" | "addresses" | "password"
interface ProfileForm  { fullName: string; phone: string; username: string }
interface PasswordForm { oldPassword: string; newPassword: string; confirmPassword: string }
interface AddressForm  { fullName: string; phone: string; street: string; city: string; province: string; postalCode: string; isDefault: boolean }

export default function Profile() {
    const [tab,        setTab]        = useState<Tab>("profile")
    const [loading,    setLoading]    = useState(false)
    const [addingAddr, setAddingAddr] = useState(false)
    const [showOld,    setShowOld]    = useState(false)
    const [showNew,    setShowNew]    = useState(false)
    const [showCfm,    setShowCfm]    = useState(false)

    const { profile: user, addresses, updateProfile, changePassword, addAddress, deleteAddress, setDefaultAddress } = useProfile()

    const { register: regProfile, handleSubmit: handleProfile } = useForm<ProfileForm>({
        defaultValues: { fullName: user?.fullName || "", phone: user?.phone || "", username: user?.username || "" }
    })
    const { register: regPass, handleSubmit: handlePass, watch: watchPass, reset: resetPass } = useForm<PasswordForm>()
    const { register: regAddr, handleSubmit: handleAddr, reset: resetAddr } = useForm<AddressForm>()

    const newPass  = watchPass("newPassword") || ""
    const strength = [newPass.length >= 8, /[A-Z]/.test(newPass), /[0-9]/.test(newPass), /[^A-Za-z0-9]/.test(newPass)].filter(Boolean).length
    const sLabel   = ["", "Weak", "Fair", "Good", "Strong"]
    const sClr     = ["", "#f87171", "#fb923c", "#facc15", "#4ade80"]
    const sTextClr = ["", "#ef4444", "#f97316", "#ca8a04", "#16a34a"]

    const onUpdateProfile  = async (d: ProfileForm)  => { try { setLoading(true); await updateProfile(d); toast.success("Profile updated!") } catch (e: unknown) { toast.error(getApiErrorMessage(e, "Failed!")) } finally { setLoading(false) } }
    const onChangePassword = async (d: PasswordForm) => { try { setLoading(true); await changePassword({ oldPassword: d.oldPassword, newPassword: d.newPassword }); toast.success("Password changed!"); resetPass() } catch (e: unknown) { toast.error(getApiErrorMessage(e, "Failed!")) } finally { setLoading(false) } }
    const onAddAddress     = async (d: AddressForm)  => { try { setLoading(true); await addAddress({ ...d, country: "Pakistan" }); setAddingAddr(false); resetAddr(); toast.success("Address added!") } catch (e: unknown) { toast.error(getApiErrorMessage(e, "Failed!")) } finally { setLoading(false) } }
    const onDeleteAddress  = async (id: string) => { try { await deleteAddress(id); toast.success("Deleted!") } catch { toast.error("Failed!") } }
    const onSetDefault     = async (id: string) => { try { await setDefaultAddress(id); toast.success("Default updated!") } catch { toast.error("Failed!") } }

    const initials = (user?.fullName || "U").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)

    const navItems: { key: Tab; label: string; icon: LucideIcon }[] = [
        { key: "profile",   label: "My Profile", icon: User   },
        { key: "addresses", label: "Addresses",  icon: Home   },
        { key: "password",  label: "Security",   icon: Shield },
    ]

    /* ── shared styles ──────────────────────────────── */
    const field: React.CSSProperties = {
        width: "100%",
        padding: "12px 16px",
        borderRadius: 12,
        border: "1.5px solid #e5e7eb",
        background: "#f9fafb",
        fontSize: 14,
        color: "#1f2937",
        outline: "none",
        boxSizing: "border-box",
        fontFamily: "inherit",
    }
    const fieldIcon: React.CSSProperties = { ...field, paddingLeft: 40 }
    const fieldDisabled: React.CSSProperties = { ...field, opacity: 0.55, cursor: "not-allowed", paddingRight: 80 }
    const fieldIconDisabled: React.CSSProperties = { ...fieldDisabled, paddingLeft: 40, paddingRight: 80 }
    const btnOrange: React.CSSProperties = {
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: "11px 28px", borderRadius: 12,
        background: "#f97316", color: "#fff",
        fontWeight: 600, fontSize: 14, border: "none", cursor: "pointer",
        boxShadow: "0 2px 8px rgba(249,115,22,0.25)",
        transition: "background .15s",
        flexShrink: 0,
    }
    const btnGhost: React.CSSProperties = {
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: "11px 24px", borderRadius: 12,
        background: "#fff", color: "#374151",
        fontWeight: 600, fontSize: 14,
        border: "1.5px solid #e5e7eb", cursor: "pointer",
        transition: "background .15s",
    }
    const lbl: React.CSSProperties = {
        display: "block",
        marginBottom: 6,
        fontSize: 11,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.07em",
        color: "#9ca3af",
    }

    return (
        <div style={{ minHeight: "calc(100vh - 64px)", width: "100%", background: "#F5F3EF" }}>

            {/* ── Banner ───────────────────────────────────── */}
            <div style={{ background: "linear-gradient(135deg,#c05e0c,#e1711c,#f59e0b)", padding: "36px 24px" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", gap: 20 }}>
                    <div style={{
                        width: 72, height: 72, borderRadius: 20,
                        background: "rgba(255,255,255,0.22)",
                        border: "2px solid rgba(255,255,255,0.35)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 26, fontWeight: 900, color: "#fff",
                        flexShrink: 0, backdropFilter: "blur(4px)",
                    }}>
                        {initials}
                    </div>
                    <div>
                        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#fff", lineHeight: 1.2 }}>
                            {user?.fullName || "Your Name"}
                        </h1>
                        <p style={{ margin: "4px 0 0", fontSize: 13, color: "rgba(255,255,255,0.75)" }}>
                            {user?.email}
                        </p>
                        <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>
                            <CheckCircle size={13} />
                            Verified Account
                            {user?.role === "admin" && (
                                <span style={{ marginLeft: 8, background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)", padding: "2px 10px", borderRadius: 999, fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                                    Admin
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Body ─────────────────────────────────────── */}
            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px 60px" }}>
                <div className="flex flex-col md:flex-row gap-6 items-start">

                    {/* ── Sidebar ──────────────────────────── */}
                    <div className="w-full md:w-[200px] shrink-0 md:sticky md:top-[88px]">
                        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #f0ede9", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                            {navItems.map((item, i) => (
                                <button
                                    key={item.key}
                                    onClick={() => setTab(item.key)}
                                    style={{
                                        width: "100%", display: "flex", alignItems: "center", gap: 12,
                                        padding: "15px 20px",
                                        background: tab === item.key ? "#f97316" : "transparent",
                                        color: tab === item.key ? "#fff" : "#6b7280",
                                        fontWeight: 600, fontSize: 14, border: "none", cursor: "pointer",
                                        borderBottom: i < navItems.length - 1 ? "1px solid #f9f6f2" : "none",
                                        textAlign: "left", transition: "background .15s",
                                    }}
                                >
                                    <item.icon size={17} style={{ flexShrink: 0 }} />
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ── Content ──────────────────────────── */}
                    <div className="w-full flex-1 min-w-0 bg-white rounded-2xl border" style={{ borderColor: "#f0ede9", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", padding: "36px 40px" }}>

                        {/* ═══ Profile Tab ═══════════════════ */}
                        {tab === "profile" && (
                            <>
                                {/* Section heading */}
                                <div style={{ display: "flex", alignItems: "center", gap: 14, paddingBottom: 24, marginBottom: 28, borderBottom: "1px solid #f3f4f6" }}>
                                    <div style={{ width: 40, height: 40, borderRadius: 12, background: "#fff7ed", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                        <User size={19} color="#f97316" />
                                    </div>
                                    <div>
                                        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#111827" }}>Personal Information</h2>
                                        <p style={{ margin: "3px 0 0", fontSize: 12, color: "#9ca3af" }}>Update your name, username and phone number</p>
                                    </div>
                                </div>

                                <form onSubmit={handleProfile(onUpdateProfile)}>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                                        {/* Full Name */}
                                        <div>
                                            <label style={lbl}>Full Name</label>
                                            <div style={{ position: "relative" }}>
                                                <User size={14} color="#d1d5db" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                                                <input {...regProfile("fullName", { required: true })} placeholder="e.g. Sara Ahmed" style={fieldIcon} />
                                            </div>
                                        </div>

                                        {/* Username */}
                                        <div>
                                            <label style={lbl}>Username</label>
                                            <div style={{ position: "relative" }}>
                                                <AtSign size={14} color="#d1d5db" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                                                <input {...regProfile("username")} placeholder="e.g. sara_reads" style={fieldIcon} />
                                            </div>
                                        </div>

                                        {/* Phone */}
                                        <div>
                                            <label style={lbl}>Phone Number</label>
                                            <div style={{ position: "relative" }}>
                                                <Phone size={14} color="#d1d5db" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                                                <input {...regProfile("phone")} placeholder="e.g. 0300 1234567" style={fieldIcon} />
                                            </div>
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label style={lbl}>Email Address</label>
                                            <div style={{ position: "relative" }}>
                                                <Mail size={14} color="#d1d5db" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                                                <input value={user?.email || ""} disabled style={fieldIconDisabled} />
                                                <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#16a34a", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 999, pointerEvents: "none" }}>
                                                    Verified
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid #f9fafb", display: "flex", justifyContent: "flex-end" }}>
                                        <button type="submit" disabled={loading} style={{ ...btnOrange, opacity: loading ? 0.65 : 1 }}>
                                            {loading && <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} />}
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}

                        {/* ═══ Addresses Tab ════════════════ */}
                        {tab === "addresses" && (
                            <>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 24, marginBottom: 28, borderBottom: "1px solid #f3f4f6" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                                        <div style={{ width: 40, height: 40, borderRadius: 12, background: "#fff7ed", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <Home size={19} color="#f97316" />
                                        </div>
                                        <div>
                                            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#111827" }}>Saved Addresses</h2>
                                            <p style={{ margin: "3px 0 0", fontSize: 12, color: "#9ca3af" }}>Manage your delivery locations</p>
                                        </div>
                                    </div>
                                    {!addingAddr && (
                                        <button onClick={() => setAddingAddr(true)} style={{ ...btnOrange, padding: "9px 18px", fontSize: 13 }}>
                                            <Plus size={14} /> Add New
                                        </button>
                                    )}
                                </div>

                                {/* Cards */}
                                {addresses && addresses.length > 0 ? (
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16, marginBottom: 24 }}>
                                        {addresses.map(addr => (
                                            <div key={addr._id} style={{
                                                borderRadius: 14,
                                                border: addr.isDefault ? "1.5px solid #fdba74" : "1.5px solid #f3f4f6",
                                                background: addr.isDefault ? "#fff7ed" : "#fafafa",
                                                padding: 20,
                                                display: "flex", flexDirection: "column", gap: 14,
                                            }}>
                                                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                                                    <div style={{ width: 36, height: 36, borderRadius: 10, background: addr.isDefault ? "#f97316" : "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                        <MapPin size={16} color={addr.isDefault ? "#fff" : "#9ca3af"} />
                                                    </div>
                                                    <div>
                                                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                                                            <span style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>{addr.fullName}</span>
                                                            {addr.isDefault && (
                                                                <span style={{ background: "#f97316", color: "#fff", fontSize: 9, fontWeight: 800, padding: "2px 8px", borderRadius: 999, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                                                    Default
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p style={{ margin: "3px 0 0", fontSize: 12, color: "#f97316", fontWeight: 600 }}>{addr.phone}</p>
                                                    </div>
                                                </div>

                                                <div style={{ background: "#fff", border: "1px solid #f3f4f6", borderRadius: 10, padding: "12px 14px" }}>
                                                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#374151" }}>{addr.street}</p>
                                                    <p style={{ margin: "4px 0 0", fontSize: 12, color: "#9ca3af" }}>{addr.city}, {addr.province}, Pakistan</p>
                                                </div>

                                                <div style={{ display: "flex", gap: 8, paddingTop: 4, borderTop: "1px solid #f3f4f6" }}>
                                                    {!addr.isDefault && (
                                                        <button onClick={() => onSetDefault(addr._id)} style={{ flex: 1, padding: "9px 0", borderRadius: 10, border: "1.5px solid #e5e7eb", background: "#fff", color: "#374151", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                                                            Set Default
                                                        </button>
                                                    )}
                                                    <button onClick={() => onDeleteAddress(addr._id)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: addr.isDefault ? "9px 0" : "9px 14px", borderRadius: 10, border: "1.5px solid #fecaca", background: "#fff", color: "#ef4444", fontSize: 12, fontWeight: 600, cursor: "pointer", flex: addr.isDefault ? 1 : undefined }}>
                                                        <Trash2 size={13} />
                                                        {addr.isDefault && "Delete"}
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    !addingAddr && (
                                        <div style={{ textAlign: "center", padding: "48px 24px", borderRadius: 14, border: "2px dashed #f3f4f6", marginBottom: 24 }}>
                                            <div style={{ width: 56, height: 56, borderRadius: 14, background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                                                <MapPin size={26} color="#e5e7eb" />
                                            </div>
                                            <p style={{ margin: 0, fontWeight: 600, color: "#6b7280", fontSize: 14 }}>No addresses saved yet</p>
                                            <p style={{ margin: "6px 0 0", fontSize: 12, color: "#d1d5db" }}>Click "Add New" to add a delivery address</p>
                                        </div>
                                    )
                                )}

                                {/* Mobile add */}
                                {!addingAddr && (
                                    <button onClick={() => setAddingAddr(true)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: "14px 0", borderRadius: 14, border: "2px dashed #fed7aa", background: "transparent", color: "#f97316", fontWeight: 600, fontSize: 14, cursor: "pointer", marginTop: 8 }}>
                                        <Plus size={16} /> Add New Address
                                    </button>
                                )}

                                {/* Add form */}
                                {addingAddr && (
                                    <form onSubmit={handleAddr(onAddAddress)} style={{ borderRadius: 14, border: "1.5px solid #fed7aa", background: "#fffbf5", padding: "24px 28px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 20, marginBottom: 20, borderBottom: "1px solid #fed7aa" }}>
                                            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#f97316", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <MapPin size={16} color="#fff" />
                                            </div>
                                            <div>
                                                <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#111827" }}>New Delivery Address</p>
                                                <p style={{ margin: "2px 0 0", fontSize: 12, color: "#9ca3af" }}>Fill in your shipping details</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label style={lbl}>Recipient Name</label>
                                                <input {...regAddr("fullName", { required: true })} placeholder="e.g. John Doe" style={field} />
                                            </div>
                                            <div>
                                                <label style={lbl}>Phone Number</label>
                                                <input {...regAddr("phone", { required: true })} placeholder="e.g. 0300 1234567" style={field} />
                                            </div>
                                            <div style={{ gridColumn: "1 / -1" }}>
                                                <label style={lbl}>Street Address</label>
                                                <input {...regAddr("street", { required: true })} placeholder="House/Apt, Street, Area" style={field} />
                                            </div>
                                            <div>
                                                <label style={lbl}>City</label>
                                                <input {...regAddr("city", { required: true })} placeholder="e.g. Karachi" style={field} />
                                            </div>
                                            <div>
                                                <label style={lbl}>Province</label>
                                                <select {...regAddr("province", { required: true })} style={field}>
                                                    <option value="">Select Province</option>
                                                    <option>Sindh</option><option>Punjab</option>
                                                    <option>KPK</option><option>Balochistan</option>
                                                    <option>Islamabad</option>
                                                </select>
                                            </div>
                                        </div>

                                        <label style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 16, padding: "14px 16px", borderRadius: 12, border: "1.5px solid #fed7aa", background: "#fff", cursor: "pointer" }}>
                                            <input type="checkbox" {...regAddr("isDefault")} style={{ width: 16, height: 16, accentColor: "#f97316" }} />
                                            <div>
                                                <p style={{ margin: 0, fontWeight: 600, fontSize: 13, color: "#111827" }}>Set as default address</p>
                                                <p style={{ margin: "2px 0 0", fontSize: 12, color: "#9ca3af" }}>Use this as your primary shipping destination</p>
                                            </div>
                                        </label>

                                        <div style={{ display: "flex", gap: 12, marginTop: 20, paddingTop: 20, borderTop: "1px solid #fed7aa" }}>
                                            <button type="button" onClick={() => { setAddingAddr(false); resetAddr() }} style={btnGhost}>Cancel</button>
                                            <button type="submit" disabled={loading} style={{ ...btnOrange, opacity: loading ? 0.65 : 1 }}>
                                                {loading && <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />}
                                                Save Address
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </>
                        )}

                        {/* ═══ Security Tab ═════════════════ */}
                        {tab === "password" && (
                            <>
                                <div style={{ display: "flex", alignItems: "center", gap: 14, paddingBottom: 24, marginBottom: 28, borderBottom: "1px solid #f3f4f6" }}>
                                    <div style={{ width: 40, height: 40, borderRadius: 12, background: "#faf5ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Lock size={19} color="#a855f7" />
                                    </div>
                                    <div>
                                        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#111827" }}>Change Password</h2>
                                        <p style={{ margin: "3px 0 0", fontSize: 12, color: "#9ca3af" }}>Keep your account secure with a strong password</p>
                                    </div>
                                </div>

                                <div style={{ maxWidth: 480 }}>
                                    <form onSubmit={handlePass(onChangePassword)} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                                        <div>
                                            <label style={lbl}>Current Password</label>
                                            <div style={{ position: "relative" }}>
                                                <input type={showOld ? "text" : "password"} {...regPass("oldPassword", { required: true })} placeholder="Enter current password" style={{ ...field, paddingRight: 44 }} />
                                                <button type="button" onClick={() => setShowOld(p => !p)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", display: "flex" }}>
                                                    {showOld ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label style={lbl}>New Password</label>
                                            <div style={{ position: "relative" }}>
                                                <input type={showNew ? "text" : "password"} {...regPass("newPassword", { required: true, minLength: { value: 8, message: "Min 8 characters" } })} placeholder="Choose a strong password" style={{ ...field, paddingRight: 44 }} />
                                                <button type="button" onClick={() => setShowNew(p => !p)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", display: "flex" }}>
                                                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                            {newPass.length > 0 && (
                                                <div style={{ marginTop: 10 }}>
                                                    <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                                                        {[1,2,3,4].map(l => (
                                                            <div key={l} style={{ height: 5, flex: 1, borderRadius: 999, background: l <= strength ? sClr[strength] : "#e5e7eb", transition: "background .3s" }} />
                                                        ))}
                                                    </div>
                                                    <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: sTextClr[strength] }}>{sLabel[strength]}</p>
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label style={lbl}>Confirm New Password</label>
                                            <div style={{ position: "relative" }}>
                                                <input type={showCfm ? "text" : "password"} {...regPass("confirmPassword", { required: true, validate: val => val === newPass || "Passwords do not match" })} placeholder="Re-enter new password" style={{ ...field, paddingRight: 44 }} />
                                                <button type="button" onClick={() => setShowCfm(p => !p)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", display: "flex" }}>
                                                    {showCfm ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                        </div>

                                        <div style={{ paddingTop: 20, borderTop: "1px solid #f9fafb" }}>
                                            <button type="submit" disabled={loading} style={{ ...btnOrange, opacity: loading ? 0.65 : 1 }}>
                                                {loading && <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} />}
                                                Update Password
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </>
                        )}

                    </div>
                </div>
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    )
}