"use client";
import { useState } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import { Megaphone, Send, CheckCircle } from "lucide-react";
import api from "../../../api/client";

const BroadcastPage = () => {
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{ sentTo: number } | null>(null);
    const [error, setError] = useState("");

    const handleBroadcast = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        setIsLoading(true);
        setResult(null);
        setError("");

        try {
            const res = await api.post("/notifications/broadcast", { message });
            setResult(res.data.data);
            setMessage("");
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to send broadcast.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AdminLayout title="Broadcast Notification">
            <div style={{ maxWidth: "720px", margin: "0 auto", padding: "32px 16px" }}>

                {/* Header Card */}
                <div style={{
                    background: "linear-gradient(135deg, #131921 0%, #1e2a3a 100%)",
                    borderRadius: "20px",
                    padding: "32px",
                    marginBottom: "28px",
                    display: "flex",
                    alignItems: "center",
                    gap: "20px"
                }}>
                    <div style={{
                        width: "56px", height: "56px", borderRadius: "16px",
                        background: "rgba(225,113,28,0.15)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0
                    }}>
                        <Megaphone size={28} color="#e1711c" />
                    </div>
                    <div>
                        <h1 style={{ margin: 0, fontSize: "22px", fontWeight: 800, color: "#fff" }}>
                            Broadcast Notification
                        </h1>
                        <p style={{ margin: "6px 0 0", fontSize: "14px", color: "#94a3b8" }}>
                            Send an announcement or promotion to all registered users at once.
                        </p>
                    </div>
                </div>

                {/* Form Card */}
                <div style={{
                    background: "#fff",
                    borderRadius: "20px",
                    padding: "32px",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                    border: "1px solid #f1f5f9"
                }}>
                    {/* Success Banner */}
                    {result && (
                        <div style={{
                            background: "#f0fdf4",
                            border: "1px solid #bbf7d0",
                            borderRadius: "12px",
                            padding: "16px 20px",
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            marginBottom: "24px"
                        }}>
                            <CheckCircle size={22} color="#16a34a" />
                            <div>
                                <p style={{ margin: 0, fontWeight: 700, color: "#15803d", fontSize: "14px" }}>
                                    Notification Sent Successfully!
                                </p>
                                <p style={{ margin: "2px 0 0", color: "#166534", fontSize: "13px" }}>
                                    Delivered to <strong>{result.sentTo}</strong> users.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Error Banner */}
                    {error && (
                        <div style={{
                            background: "#fef2f2",
                            border: "1px solid #fecaca",
                            borderRadius: "12px",
                            padding: "16px 20px",
                            marginBottom: "24px",
                            color: "#dc2626",
                            fontSize: "14px"
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleBroadcast}>
                        <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#374151", marginBottom: "8px" }}>
                            Message
                        </label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="E.g: 🎉 Summer Sale! Get 20% off on all books this week. Use code: SUMMER20 at checkout."
                            rows={5}
                            required
                            style={{
                                width: "100%",
                                border: "1.5px solid #e2e8f0",
                                borderRadius: "12px",
                                padding: "14px 16px",
                                fontSize: "14px",
                                color: "#1e293b",
                                resize: "vertical",
                                outline: "none",
                                fontFamily: "inherit",
                                boxSizing: "border-box",
                                transition: "border-color 0.2s"
                            }}
                            onFocus={e => e.currentTarget.style.borderColor = "#e1711c"}
                            onBlur={e => e.currentTarget.style.borderColor = "#e2e8f0"}
                        />

                        <p style={{ margin: "8px 0 24px", fontSize: "12px", color: "#94a3b8" }}>
                            {message.length} / 300 characters
                        </p>

                        <button
                            type="submit"
                            disabled={isLoading || !message.trim()}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                padding: "13px 28px",
                                background: isLoading || !message.trim() ? "#94a3b8" : "#e1711c",
                                color: "#fff",
                                border: "none",
                                borderRadius: "12px",
                                fontSize: "15px",
                                fontWeight: 700,
                                cursor: isLoading || !message.trim() ? "not-allowed" : "pointer",
                                transition: "background 0.2s"
                            }}
                            onMouseEnter={e => {
                                if (!isLoading && message.trim())
                                    (e.currentTarget as HTMLElement).style.background = "#c85f10"
                            }}
                            onMouseLeave={e => {
                                if (!isLoading && message.trim())
                                    (e.currentTarget as HTMLElement).style.background = "#e1711c"
                            }}
                        >
                            {isLoading ? (
                                <>
                                    <span style={{
                                        width: "16px", height: "16px",
                                        border: "2px solid rgba(255,255,255,0.3)",
                                        borderTop: "2px solid #fff",
                                        borderRadius: "50%",
                                        animation: "spin 0.8s linear infinite",
                                        display: "inline-block"
                                    }} />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send size={17} />
                                    Send to All Users
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Info box */}
                <div style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "14px",
                    padding: "20px 24px",
                    marginTop: "20px"
                }}>
                    <p style={{ margin: "0 0 10px", fontSize: "13px", fontWeight: 700, color: "#475569" }}>📌 How it works:</p>
                    <ul style={{ margin: 0, padding: "0 0 0 18px", fontSize: "13px", color: "#64748b", lineHeight: 1.9 }}>
                        <li>The message will be sent to <strong>all active users</strong> instantly.</li>
                        <li>Users will see it in the <strong>Bell (🔔) Notification icon</strong> on their Navbar.</li>
                        <li>Great for announcing <strong>sales, new arrivals, or important updates</strong>.</li>
                    </ul>
                </div>
            </div>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </AdminLayout>
    );
};

export default BroadcastPage;
