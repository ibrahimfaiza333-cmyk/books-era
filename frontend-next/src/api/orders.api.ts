import api, { unwrapData } from "./client"
import type { Order } from "../types"

export interface OrdersListResult {
    orders: Order[]
    totalPages: number
}

export interface ValidateCouponPayload {
    code: string
    orderAmount?: number
}

export interface ValidateCouponResult {
    discount: number
}

export interface ShippingAddressPayload {
    fullName: string
    phone: string
    street: string
    city: string
    province: string
    postalCode?: string
    country: string
}

export interface CreateOrderPayload {
    shippingAddress: ShippingAddressPayload
    paymentMethod: "cod"
    couponCode?: string
    note?: string
}

export interface CancelOrderPayload {
    cancelReason: string
}

export async function getOrders(page: number, limit = 10): Promise<OrdersListResult> {
    return unwrapData(api.get(`/orders?page=${page}&limit=${limit}`))
}

export async function getOrderById(id: string): Promise<Order> {
    return unwrapData(api.get(`/orders/${id}`))
}

export async function cancelOrder(
    id: string,
    payload: CancelOrderPayload
): Promise<void> {
    await unwrapData(api.patch(`/orders/${id}/cancel`, payload))
}

export async function validateCoupon(
    payload: ValidateCouponPayload
): Promise<ValidateCouponResult> {
    return unwrapData(api.post("/coupons/validate", payload))
}

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
    return unwrapData(api.post("/orders/place", payload))
}
