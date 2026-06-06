"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react"
import Link from "next/link";
import { useForm } from "react-hook-form"
import { Eye, EyeOff, BookOpen, Loader2 } from "lucide-react"
import { useAuth } from "../hooks/useAuth"
import { getApiErrorMessage } from "../lib/api-error"
import { toast } from "react-toastify";
import { APP_NAME } from "../utils/constants"
import { useAppSelector } from "../store/hooks"

interface LoginForm {
    email:    string
    password: string
}

const Login = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [loading,      setLoading]      = useState(false)
    const navigate = useRouter()
    const { login } = useAuth()
    const { isLoggedIn } = useAppSelector(state => state.auth)

    useEffect(() => {
        if (isLoggedIn) {
            navigate.replace("/")
        }
    }, [isLoggedIn, navigate])

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginForm>()

    const onSubmit = async (data: LoginForm) => {
        try {
            setLoading(true)
            await login(data)
            toast.success("Login successful!")
            navigate.push("/")
        } catch (err: unknown) {
            toast.error(getApiErrorMessage(err, "Login failed!"))
        } finally {
            setLoading(false)
        }
    }

    if (isLoggedIn) return null;

    return (
        <div style={{ minHeight: "100vh", width: "100%", background: "#F5F3EF", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px", position: "relative", overflow: "hidden" }}>
            
            {/* Background Ornaments */}
            <div style={{ position: "absolute", top: "-10%", left: "-5%", width: 500, height: 500, background: "radial-gradient(circle, rgba(249,115,22,0.1) 0%, rgba(249,115,22,0) 70%)", borderRadius: "50%", filter: "blur(40px)", zIndex: 0, pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: "-10%", right: "-5%", width: 400, height: 400, background: "radial-gradient(circle, rgba(249,115,22,0.08) 0%, rgba(249,115,22,0) 70%)", borderRadius: "50%", filter: "blur(40px)", zIndex: 0, pointerEvents: "none" }} />

            <div style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 1, margin: "0 auto" }}>
                
                <div style={{ background: "#fff", borderRadius: 28, padding: "clamp(24px, 6vw, 40px) clamp(20px, 6vw, 32px)", boxShadow: "0 20px 60px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.02)", border: "1px solid rgba(255,255,255,0.8)" }}>
                    
                    {/* Header */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, marginBottom: 36, textAlign: "center" }}>
                        <div style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 10px rgba(249,115,22,0.1)" }}>
                            <BookOpen size={28} color="#f97316" />
                        </div>
                        <div>
                            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "#111827", letterSpacing: "-0.02em" }}>
                                Welcome Back!
                            </h1>
                            <p style={{ margin: "6px 0 0", fontSize: 14, color: "#6b7280" }}>
                                Login to your {APP_NAME} account
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        
                        {/* Email */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            <label style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>Email Address</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email format" }
                                })}
                                style={{
                                    width: "100%", padding: "14px 16px", borderRadius: 14, fontSize: 14,
                                    background: "#f9fafb", border: errors.email ? "1px solid #fca5a5" : "1px solid #e5e7eb",
                                    color: "#111827", outline: "none", transition: "all .2s"
                                }}
                                onFocus={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = errors.email ? "#ef4444" : "#fbd38d"; e.currentTarget.style.boxShadow = errors.email ? "0 0 0 4px rgba(239,68,68,0.1)" : "0 0 0 4px rgba(249,115,22,0.1)" }}
                                onBlur={(e) => { e.currentTarget.style.background = "#f9fafb"; e.currentTarget.style.borderColor = errors.email ? "#fca5a5" : "#e5e7eb"; e.currentTarget.style.boxShadow = "none" }}
                            />
                            {errors.email && <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#ef4444" }}>{errors.email.message}</p>}
                        </div>

                        {/* Password */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <label style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>Password</label>
                                <Link href="/forgot-password" style={{ fontSize: 13, fontWeight: 600, color: "#f97316", textDecoration: "none" }}>
                                    Forgot Password?
                                </Link>
                            </div>
                            <div style={{ position: "relative" }}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: { value: 8, message: "Password must be 8+ characters" }
                                    })}
                                    style={{
                                        width: "100%", padding: "14px 44px 14px 16px", borderRadius: 14, fontSize: 14,
                                        background: "#f9fafb", border: errors.password ? "1px solid #fca5a5" : "1px solid #e5e7eb",
                                        color: "#111827", outline: "none", transition: "all .2s"
                                    }}
                                    onFocus={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = errors.password ? "#ef4444" : "#fbd38d"; e.currentTarget.style.boxShadow = errors.password ? "0 0 0 4px rgba(239,68,68,0.1)" : "0 0 0 4px rgba(249,115,22,0.1)" }}
                                    onBlur={(e) => { e.currentTarget.style.background = "#f9fafb"; e.currentTarget.style.borderColor = errors.password ? "#fca5a5" : "#e5e7eb"; e.currentTarget.style.boxShadow = "none" }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                                        background: "none", border: "none", padding: 4, cursor: "pointer",
                                        color: "#9ca3af", display: "flex", alignItems: "center", justifyContent: "center"
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = "#4b5563"}
                                    onMouseLeave={(e) => e.currentTarget.style.color = "#9ca3af"}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#ef4444" }}>{errors.password.message}</p>}
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
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    {/* Footer */}
                    <div style={{ marginTop: 32, textAlign: "center" }}>
                        <p style={{ margin: 0, fontSize: 14, color: "#6b7280", fontWeight: 500 }}>
                            Don't have an account?{" "}
                            <Link href="/register" style={{ color: "#f97316", fontWeight: 700, textDecoration: "none" }}>
                                Register here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    )
}

export default Login