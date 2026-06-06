import { useQuery, useQueryClient } from "@tanstack/react-query"
import {
    getCart as getCartApi,
    addToCart as addToCartApi,
    updateCartItem as updateCartItemApi,
    removeFromCart as removeFromCartApi,
    clearCart as clearCartApi,
    type AddToCartPayload,
} from "../api/cart.api"
import { queryKeys } from "../lib/query-keys"

interface ClearCartOptions {
    /** When false, only clears cache (e.g. after order placed). Default true. */
    callApi?: boolean
}

interface UseCartOptions {
    enabled?: boolean
}

export function useCart(options?: UseCartOptions) {
    const queryClient = useQueryClient()

    const query = useQuery({
        queryKey: queryKeys.cart,
        queryFn: getCartApi,
        enabled: options?.enabled ?? true,
    })

    const syncCart = (cart: Awaited<ReturnType<typeof getCartApi>>) => {
        queryClient.setQueryData(queryKeys.cart, cart)
    }

    const addToCart = async (payload: AddToCartPayload) => {
        const cart = await addToCartApi(payload)
        syncCart(cart)
        return cart
    }

    const updateQuantity = async (bookId: string, quantity: number) => {
        const cart = await updateCartItemApi({ bookId, quantity })
        syncCart(cart)
        return cart
    }

    const removeItem = async (bookId: string) => {
        const cart = await removeFromCartApi(bookId)
        syncCart(cart)
        return cart
    }

    const clearCart = async (clearOptions?: ClearCartOptions) => {
        if (clearOptions?.callApi !== false) {
            await clearCartApi()
        }
        await queryClient.invalidateQueries({ queryKey: queryKeys.cart })
    }

    return {
        cart: query.data,
        totalItems: query.data?.totalItems ?? 0,
        isLoading: query.isLoading,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
    }
}
