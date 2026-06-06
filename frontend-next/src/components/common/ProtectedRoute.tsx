"use client";
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useAppSelector } from "../../store/hooks"

interface Props {
    children: React.ReactNode
}

const ProtectedRoute = ({ children }: Props) => {
    const { isLoggedIn } = useAppSelector(state => state.auth)
    const router = useRouter()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        if (!isLoggedIn) router.replace("/login")
    }, [isLoggedIn, router])

    if (!mounted || !isLoggedIn) return null;
    return <>{children}</>
}

export default ProtectedRoute;