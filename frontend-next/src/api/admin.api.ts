import api, { unwrapData } from "./client"
import type { Book, Order } from "../types"
import type { BookFormPayload } from "./books.api"

export interface AdminBooksListResult {
    books: Book[]
    totalPages: number
}

export interface AdminOrdersListResult {
    orders: Order[]
    totalPages: number
}

export interface AdminUser {
    _id: string
    fullName: string
    email: string
    username: string
    phone?: string
    isActive: boolean
    createdAt: string
    addresses?: { city?: string; province?: string }[]
}

export interface AdminUsersListResult {
    users: AdminUser[]
    total: number
    totalPages: number
}

export interface AdminDashboardStats {
    stats: Record<string, number>
    recentOrders: Order[]
    lowStockBooks: Book[]
}

export interface BanUserResult {
    message: string
}

export async function getDashboardStats(): Promise<AdminDashboardStats> {
    return unwrapData(api.get("/admin/dashboard/stats"))
}

export async function getAdminBooks(
    page: number,
    limit: number,
    search: string
): Promise<AdminBooksListResult> {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        search,
    })
    return unwrapData(api.get(`/admin/books?${params}`))
}

export async function toggleBookActive(id: string): Promise<void> {
    await unwrapData(api.patch(`/admin/books/${id}/toggle-active`))
}

export async function getAdminOrders(
    page: number,
    limit: number,
    orderStatus?: string
): Promise<AdminOrdersListResult> {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(orderStatus && { orderStatus }),
    })
    return unwrapData(api.get(`/admin/orders?${params}`))
}

export async function updateOrderStatus(
    orderId: string,
    orderStatus: string
): Promise<void> {
    await unwrapData(
        api.patch(`/admin/orders/${orderId}/status`, { orderStatus })
    )
}

export async function getAdminUsers(
    page: number,
    limit: number,
    search: string
): Promise<AdminUsersListResult> {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        role: "user",
        ...(search && { search }),
    })
    return unwrapData(api.get(`/admin/users?${params}`))
}

export async function banUser(userId: string): Promise<BanUserResult> {
    return unwrapData(api.patch(`/admin/users/${userId}/ban`))
}

export async function deleteUser(userId: string): Promise<void> {
    await unwrapData(api.delete(`/admin/users/${userId}`))
}

export interface SalesReportData {
    overview: {
        totalRevenue: number
        totalOrders: number
        avgOrder: number
        totalDiscount: number
    }
    topBooks: {
        _id: string
        title: string
        totalSold: number
        revenue: number
    }[]
    paymentMethods: {
        _id: string
        count: number
        total: number
    }[]
    ordersByStatus: {
        _id: string
        count: number
    }[]
}

export async function getSalesReport(
    startDate?: string,
    endDate?: string
): Promise<SalesReportData> {
    const params = new URLSearchParams()
    if (startDate) params.set("startDate", startDate)
    if (endDate) params.set("endDate", endDate)
    return unwrapData(api.get(`/admin/sales-report?${params}`))
}

export type { BookFormPayload }
