"use client";
import { useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { RootState } from "../store/store"

export default function AdminRootLayout({ children }: { children?: React.ReactNode }) {
    const { user } = useSelector((state: RootState) => state.auth)
    const router = useRouter()

    if (!user || user.role !== "admin") {
        router.push("/")
        return null
    }

    return <>{children}</>
}
