"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import api from "../../api/client";

const Newsletter = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast.error("Please enter your email");
            return;
        }

        setIsLoading(true);
        try {
            await api.post("/newsletter/subscribe", { email });
            toast.success("Successfully subscribed! Check your inbox.");
            setEmail("");
        } catch (error: any) {
            const msg = error?.response?.data?.message || "Failed to subscribe. Please try again later.";
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section 
            className="w-full relative overflow-hidden py-24 md:py-32 flex items-center justify-center min-h-[450px]"
            style={{
                backgroundImage: "url('/images/newsletter-bg.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            {/* Overlay matching navbar dark tone but lighter to show image */}
            <div className="absolute inset-0 z-0" style={{ background: "rgba(19,25,33,0.4)" }}></div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col items-center justify-center text-center">
                
                {/* Advanced Glassmorphic Capsule - made more transparent */}
                <div className="w-full bg-black/20 backdrop-blur-sm border border-white/[0.1] rounded-3xl p-8 md:p-14 shadow-[0_15px_30px_-10px_rgba(0,0,0,0.5)] relative overflow-hidden">
                    
                    {/* Subtle Radial Glow in background inside the card */}
                    <div className="absolute -top-24 -left-24 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col items-center text-center">
                        {/* Premium Text Styling */}
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight" style={{ paddingTop: "16px", paddingBottom: "16px", marginBottom: "16px" }}>
                            Join Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-200">Book Club</span>
                        </h2>
                        
                        <p className="text-zinc-300 text-sm md:text-base mb-8 leading-relaxed max-w-lg mx-auto font-medium text-center">
                            Subscribe to our newsletter and get updates on new arrivals, exclusive deals, and book recommendations.
                        </p>

                        {/* Search-bar style form with increased Top & Bottom Margin */}
                        <form
                            onSubmit={handleSubscribe}
                            className="flex items-center bg-white rounded-md shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-[#e1711c] transition-all duration-300 w-full max-w-[280px] xs:max-w-[340px] sm:max-w-[420px] h-12"
                            style={{ marginTop: "32px", marginBottom: "24px" }}
                        >
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address..."
                                required
                                className="bg-transparent text-gray-800 outline-none flex-1 font-medium placeholder-gray-400"
                                style={{ paddingLeft: "18px", fontSize: "14px" }}
                            />
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="h-full flex justify-center items-center transition-colors disabled:opacity-70 disabled:cursor-not-allowed font-bold text-gray-900"
                                style={{ width: "110px", background: "#e1711c", fontSize: "14px" }}
                                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#c85f10"}
                                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "#e1711c"}
                            >
                                {isLoading ? (
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                ) : (
                                    <span style={{ color: "#fff" }}>Subscribe</span>
                                )}
                            </button>
                        </form>

                    </div>
                    
                </div>
            </div>
        </section>
    );
};

export default Newsletter;