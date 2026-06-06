import api, { unwrapData } from "./client"
import type { Cart } from "../types"

export interface AddToCartPayload {
    bookId: string
    quantity: number
}

export interface UpdateCartPayload {
    bookId: string
    quantity: number
}

export async function getCart(): Promise<Cart> {
    return unwrapData(api.get("/cart"))
}

export async function addToCart(payload: AddToCartPayload): Promise<Cart> {
    return unwrapData(api.post("/cart/add", payload))
}

export async function updateCartItem(payload: UpdateCartPayload): Promise<Cart> {
    return unwrapData(api.patch("/cart/update", payload))
}

export async function removeFromCart(bookId: string): Promise<Cart> {
    return unwrapData(api.delete(`/cart/remove/${bookId}`))
}

export async function clearCart(): Promise<void> {
    await unwrapData(api.delete("/cart/clear"))
}
