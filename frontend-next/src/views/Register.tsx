"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react"
import Link from "next/link";
import { useForm } from "react-hook-form"
import { Eye, EyeOff, BookOpen, Loader2, ChevronDown } from "lucide-react"
import { toast } from "react-toastify";
import { useAuth } from "../hooks/useAuth"
import { getApiErrorMessage } from "../lib/api-error"
import { APP_NAME } from "../utils/constants"
import { useAppSelector } from "../store/hooks"

interface RegisterForm {
    fullName: string
    username: string
    email: string
    phone: string
    password: string
    confirmPassword: string
    street: string
    city: string
    province: string
    postalCode?: string
}

const Register = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const navigate = useRouter()
    const { register: registerUser } = useAuth()
    const { isLoggedIn } = useAppSelector(state => state.auth)

    useEffect(() => {
        if (isLoggedIn) {
            navigate.replace("/")
        }
    }, [isLoggedIn, navigate])

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterForm>()

    const password = watch("password")

    const onSubmit = async (data: RegisterForm) => {
        try {
            setLoading(true)

            await registerUser({
                fullName: data.fullName,
                username: data.username,
                email: data.email,
                phone: data.phone,
                password: data.password,
                address: {
                    street: data.street,
                    city: data.city,
                    province: data.province,
                    postalCode: data.postalCode || "",
                    country: "Pakistan",
                },
            })

            toast.success("Account created successfully!")
            navigate.push("/login")
        } catch (error: unknown) {
            toast.error(getApiErrorMessage(error, "Registration failed"))
        } finally {
            setLoading(false)
        }
    }

    if (isLoggedIn) return null;

    const inputStyle = {
        width: "100%", padding: "14px 16px", borderRadius: 14, fontSize: 14,
        background: "#f9fafb", color: "#111827", outline: "none", transition: "all .2s"
    };

    const handleFocus = (e: any, hasError: boolean) => {
        e.currentTarget.style.background = "#fff";
        e.currentTarget.style.borderColor = hasError ? "#ef4444" : "#fbd38d";
        e.currentTarget.style.boxShadow = hasError ? "0 0 0 4px rgba(239,68,68,0.1)" : "0 0 0 4px rgba(249,115,22,0.1)";
    };

    const handleBlur = (e: any, hasError: boolean) => {
        e.currentTarget.style.background = "#f9fafb";
        e.currentTarget.style.borderColor = hasError ? "#fca5a5" : "#e5e7eb";
        e.currentTarget.style.boxShadow = "none";
    };

    return (
        <div style={{ minHeight: "100vh", width: "100%", background: "#F5F3EF", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px", position: "relative", overflow: "hidden" }}>
            
            {/* Background Ornaments */}
            <div style={{ position: "absolute", top: "-10%", left: "-5%", width: 500, height: 500, background: "radial-gradient(circle, rgba(249,115,22,0.1) 0%, rgba(249,115,22,0) 70%)", borderRadius: "50%", filter: "blur(40px)", zIndex: 0, pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: "-10%", right: "-5%", width: 400, height: 400, background: "radial-gradient(circle, rgba(249,115,22,0.08) 0%, rgba(249,115,22,0) 70%)", borderRadius: "50%", filter: "blur(40px)", zIndex: 0, pointerEvents: "none" }} />

            <div style={{ width: "100%", maxWidth: 600, position: "relative", zIndex: 1, margin: "0 auto" }}>
                
                <div style={{ background: "#fff", borderRadius: 28, padding: "clamp(24px, 6vw, 40px) clamp(20px, 6vw, 32px)", boxShadow: "0 20px 60px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.02)", border: "1px solid rgba(255,255,255,0.8)" }}>
                    
                    {/* Header */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, marginBottom: 36, textAlign: "center" }}>
                        <div style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 10px rgba(249,115,22,0.1)" }}>
                            <BookOpen size={28} color="#f97316" />
                        </div>
                        <div>
                            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "#111827", letterSpacing: "-0.02em" }}>
                                Create Account
                            </h1>
                            <p style={{ margin: "6px 0 0", fontSize: 14, color: "#6b7280" }}>
                                Join {APP_NAME} today
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        
                        {/* Personal Info */}
                        <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: "#ea580c", textTransform: "uppercase", letterSpacing: 1.2 }}>
                            Personal Info
                        </p>

                        {/* Full Name */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            <label style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>Full Name</label>
                            <input
                                type="text"
                                placeholder="Enter your full name"
                                autoComplete="name"
                                disabled={loading}
                                {...register("fullName", {
                                    required: "Full name is required",
                                    minLength: { value: 3, message: "Minimum 3 characters" },
                                })}
                                style={{ ...inputStyle, border: errors.fullName ? "1px solid #fca5a5" : "1px solid #e5e7eb" }}
                                onFocus={(e) => handleFocus(e, !!errors.fullName)}
                                onBlur={(e) => handleBlur(e, !!errors.fullName)}
                            />
                            {errors.fullName && <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#ef4444" }}>{errors.fullName.message}</p>}
                        </div>

                        {/* Username + Phone */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                            {/* Username */}
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                <label style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>Username</label>
                                <input
                                    type="text"
                                    placeholder="username"
                                    autoComplete="username"
                                    disabled={loading}
                                    {...register("username", {
                                        required: "Username is required",
                                        minLength: { value: 3, message: "Minimum 3 characters" },
                                        pattern: { value: /^[a-z0-9_]+$/, message: "Lowercase, numbers & _ only" },
                                    })}
                                    style={{ ...inputStyle, border: errors.username ? "1px solid #fca5a5" : "1px solid #e5e7eb" }}
                                    onFocus={(e) => handleFocus(e, !!errors.username)}
                                    onBlur={(e) => handleBlur(e, !!errors.username)}
                                />
                                {errors.username && <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#ef4444" }}>{errors.username.message}</p>}
                            </div>

                            {/* Phone */}
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                <label style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>Phone</label>
                                <input
                                    type="tel"
                                    placeholder="03001234567"
                                    autoComplete="tel"
                                    disabled={loading}
                                    {...register("phone", {
                                        required: "Phone is required",
                                        pattern: { value: /^03[0-9]{9}$/, message: "Valid Pakistani number" },
                                    })}
                                    style={{ ...inputStyle, border: errors.phone ? "1px solid #fca5a5" : "1px solid #e5e7eb" }}
                                    onFocus={(e) => handleFocus(e, !!errors.phone)}
                                    onBlur={(e) => handleBlur(e, !!errors.phone)}
                                />
                                {errors.phone && <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#ef4444" }}>{errors.phone.message}</p>}
                            </div>
                        </div>

                        {/* Email */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            <label style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>Email Address</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                autoComplete="email"
                                disabled={loading}
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email format" },
                                })}
                                style={{ ...inputStyle, border: errors.email ? "1px solid #fca5a5" : "1px solid #e5e7eb" }}
                                onFocus={(e) => handleFocus(e, !!errors.email)}
                                onBlur={(e) => handleBlur(e, !!errors.email)}
                            />
                            {errors.email && <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#ef4444" }}>{errors.email.message}</p>}
                        </div>

                        {/* Passwords */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                            {/* Password */}
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                <label style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>Password</label>
                                <div style={{ position: "relative" }}>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Min 8 chars"
                                        autoComplete="new-password"
                                        disabled={loading}
                                        {...register("password", {
                                            required: "Password is required",
                                            minLength: { value: 8, message: "Minimum 8 characters" },
                                        })}
                                        style={{ ...inputStyle, paddingRight: 40, border: errors.password ? "1px solid #fca5a5" : "1px solid #e5e7eb" }}
                                        onFocus={(e) => handleFocus(e, !!errors.password)}
                                        onBlur={(e) => handleBlur(e, !!errors.password)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#9ca3af", cursor: "pointer", display: "flex" }}
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {errors.password && <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#ef4444" }}>{errors.password.message}</p>}
                            </div>

                            {/* Confirm Password */}
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                <label style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>Confirm Password</label>
                                <div style={{ position: "relative" }}>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm"
                                        autoComplete="new-password"
                                        disabled={loading}
                                        {...register("confirmPassword", {
                                            required: "Please confirm",
                                            validate: (value) => value === password || "Doesn't match",
                                        })}
                                        style={{ ...inputStyle, paddingRight: 40, border: errors.confirmPassword ? "1px solid #fca5a5" : "1px solid #e5e7eb" }}
                                        onFocus={(e) => handleFocus(e, !!errors.confirmPassword)}
                                        onBlur={(e) => handleBlur(e, !!errors.confirmPassword)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#9ca3af", cursor: "pointer", display: "flex" }}
                                    >
                                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {errors.confirmPassword && <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#ef4444" }}>{errors.confirmPassword.message}</p>}
                            </div>
                        </div>

                        {/* Address Section */}
                        <p style={{ margin: "10px 0 0", fontSize: 11, fontWeight: 700, color: "#ea580c", textTransform: "uppercase", letterSpacing: 1.2 }}>
                            Delivery Address
                        </p>

                        {/* Street */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            <label style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>Street Address</label>
                            <input
                                type="text"
                                placeholder="House #, Street, Area"
                                autoComplete="street-address"
                                disabled={loading}
                                {...register("street", { required: "Street address is required" })}
                                style={{ ...inputStyle, border: errors.street ? "1px solid #fca5a5" : "1px solid #e5e7eb" }}
                                onFocus={(e) => handleFocus(e, !!errors.street)}
                                onBlur={(e) => handleBlur(e, !!errors.street)}
                            />
                            {errors.street && <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#ef4444" }}>{errors.street.message}</p>}
                        </div>

                        {/* City + Province */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                <label style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>City</label>
                                <input
                                    type="text"
                                    placeholder="Karachi"
                                    disabled={loading}
                                    {...register("city", { required: "City is required" })}
                                    style={{ ...inputStyle, border: errors.city ? "1px solid #fca5a5" : "1px solid #e5e7eb" }}
                                    onFocus={(e) => handleFocus(e, !!errors.city)}
                                    onBlur={(e) => handleBlur(e, !!errors.city)}
                                />
                                {errors.city && <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#ef4444" }}>{errors.city.message}</p>}
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                <label style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>Province</label>
                                <div style={{ position: "relative" }}>
                                    <select
                                        disabled={loading}
                                        {...register("province", { required: "Province is required" })}
                                        style={{ ...inputStyle, width: "100%", border: errors.province ? "1px solid #fca5a5" : "1px solid #e5e7eb", appearance: "none" }}
                                        onFocus={(e) => handleFocus(e, !!errors.province)}
                                        onBlur={(e) => handleBlur(e, !!errors.province)}
                                    >
                                        <option value="">Select Province</option>
                                        <option value="Sindh">Sindh</option>
                                        <option value="Punjab">Punjab</option>
                                        <option value="Balochistan">Balochistan</option>
                                        <option value="KPK">KPK</option>
                                        <option value="Gilgit Baltistan">Gilgit Baltistan</option>
                                        <option value="Azad Kashmir">Azad Kashmir</option>
                                    </select>
                                    <ChevronDown size={18} style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", pointerEvents: "none" }} />
                                </div>
                                {errors.province && <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#ef4444" }}>{errors.province.message}</p>}
                            </div>
                        </div>

                        {/* Postal Code */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            <label style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>
                                Postal Code <span style={{ color: "#9ca3af", fontWeight: 400 }}>(Optional)</span>
                            </label>
                            <input
                                type="text"
                                placeholder="75000"
                                disabled={loading}
                                {...register("postalCode")}
                                style={{ ...inputStyle, border: "1px solid #e5e7eb" }}
                                onFocus={(e) => handleFocus(e, false)}
                                onBlur={(e) => handleBlur(e, false)}
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: "100%", padding: "14px", borderRadius: 14, marginTop: 12,
                                background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                                color: "#fff", border: "none", fontSize: 15, fontWeight: 700,
                                cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
                                boxShadow: "0 6px 20px rgba(234,88,12,0.3)", transition: "all .2s",
                                display: "flex", alignItems: "center", justifyContent: "center", gap: 10
                            }}
                            onMouseEnter={(e) => { if(!loading) e.currentTarget.style.transform = "translateY(-1px)"; if(!loading) e.currentTarget.style.boxShadow = "0 8px 25px rgba(234,88,12,0.4)" }}
                            onMouseLeave={(e) => { if(!loading) e.currentTarget.style.transform = "translateY(0)"; if(!loading) e.currentTarget.style.boxShadow = "0 6px 20px rgba(234,88,12,0.3)" }}
                            onMouseDown={(e) => { if(!loading) e.currentTarget.style.transform = "translateY(1px)" }}
                            onMouseUp={(e) => { if(!loading) e.currentTarget.style.transform = "translateY(-1px)" }}
                        >
                            {loading && <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />}
                            {loading ? "Creating account..." : "Create Account"}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div style={{ marginTop: 32, textAlign: "center" }}>
                        <p style={{ margin: 0, fontSize: 14, color: "#6b7280", fontWeight: 500 }}>
                            Already have an account?{" "}
                            <Link href="/login" style={{ color: "#f97316", fontWeight: 700, textDecoration: "none" }}>
                                Login here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    )
}

export default Register