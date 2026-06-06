"use client";
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useAppSelector } from "../../store/hooks"

interface Props {
    children: React.ReactNode
}

const AdminRoute = ({ children }: Props) => {
    const { isLoggedIn, user } = useAppSelector(state => state.auth)
    const router = useRouter()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        if (!isLoggedIn) router.replace("/login")
        else if (user?.role !== "admin") router.replace("/")
    }, [isLoggedIn, user, router])

    if (!mounted || !isLoggedIn || user?.role !== "admin") return null;
    return <>{children}</>
}

export default AdminRoute