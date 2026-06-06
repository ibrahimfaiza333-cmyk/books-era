"use client";
import { usePathname } from "next/navigation"
import Navbar from "../components/common/Navbar"
import Footer from "../components/common/Footer"

export default function MainLayout({ children }: { children?: React.ReactNode }) {
    const pathname = usePathname() ?? ""

    const hideLayoutRoutes = [
        "/login",
        "/register",
        "/forgot-password"
    ]

    const hideLayout =
        hideLayoutRoutes.includes(pathname) ||
        pathname.startsWith("/reset-password")

    return (
        <div className="flex min-h-screen flex-col bg-[#F9F9F9] dark:bg-gray-900 transition-colors duration-300">
            {!hideLayout && <Navbar />}
            <main className={`flex-1 w-full ${!hideLayout ? 'pt-16' : ''}`}>
                {children}
            </main>
            {!hideLayout && <Footer />}
        </div>
    )
}
