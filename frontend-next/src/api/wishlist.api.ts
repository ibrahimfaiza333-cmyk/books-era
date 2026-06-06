import api, { unwrapData } from "./client"
import type { Book } from "../types"

export async function getWishlist(): Promise<Book[]> {
    return unwrapData(api.get("/wishlist"))
}

export async function addToWishlist(bookId: string): Promise<void> {
    await unwrapData(api.post(`/wishlist/${bookId}`))
}

export async function removeFromWishlist(bookId: string): Promise<void> {
    await unwrapData(api.delete(`/wishlist/${bookId}`))
}
