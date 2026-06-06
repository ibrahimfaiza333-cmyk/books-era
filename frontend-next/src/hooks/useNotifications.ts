import { useState, useEffect, useCallback } from "react"
import api from "../api/client"

interface Notification {
    _id: string
    message: string
    type: string
    isRead: boolean
    createdAt: string
}

export const useNotifications = ({ enabled = true } = {}) => {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)

    const fetchNotifications = useCallback(async () => {
        if (!enabled) return;
        try {
            setIsError(false)
            const res = await api.get("/notifications")
            setNotifications(res.data.data || [])
        } catch (error) {
            console.error("Failed to fetch notifications", error)
            setIsError(true)
        }
    }, [enabled])

    // Fetch initially, poll every 15 seconds, and fetch on window focus
    useEffect(() => {
        if (!enabled) return;
        
        setIsLoading(true)
        fetchNotifications().finally(() => setIsLoading(false))

        // Poll every 60 seconds to avoid hitting rate limits
        const intervalId = setInterval(fetchNotifications, 60000)

        // Refetch when user switches tabs back to this window
        const onFocus = () => fetchNotifications()
        window.addEventListener("focus", onFocus)

        return () => {
            clearInterval(intervalId)
            window.removeEventListener("focus", onFocus)
        }
    }, [fetchNotifications, enabled])

    const unreadCount = notifications.filter((n) => !n.isRead).length

    const markAsRead = async (id: string) => {
        try {
            // Optimistic update
            setNotifications(prev => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)))
            await api.put(`/notifications/${id}/read`)
        } catch (error) {
            console.error("Failed to mark notification as read", error)
            fetchNotifications() // Revert on failure
        }
    }

    const markAllAsRead = async () => {
        try {
            // Optimistic update
            setNotifications(prev => prev.map((n) => ({ ...n, isRead: true })))
            await api.put(`/notifications/read-all`)
        } catch (error) {
            console.error("Failed to mark all as read", error)
            fetchNotifications() // Revert on failure
        }
    }

    return {
        notifications,
        unreadCount,
        isLoading,
        isError,
        markAsRead,
        markAllAsRead,
        mutate: fetchNotifications, // For manual refetch
    }
}
