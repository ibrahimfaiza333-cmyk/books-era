import { useQuery, useQueryClient } from "@tanstack/react-query"
import {
    getWishlist as getWishlistApi,
    addToWishlist as addToWishlistApi,
    removeFromWishlist as removeFromWishlistApi,
} from "../api/wishlist.api"
import { queryKeys } from "../lib/query-keys"

export function useWishlist() {
    const queryClient = useQueryClient()

    const query = useQuery({
        queryKey: queryKeys.wishlist,
        queryFn: getWishlistApi,
    })

    const invalidateWishlist = () =>
        queryClient.invalidateQueries({ queryKey: queryKeys.wishlist })

    const addToWishlist = async (bookId: string) => {
        await addToWishlistApi(bookId)
        await invalidateWishlist()
    }

    const removeFromWishlist = async (bookId: string) => {
        await removeFromWishlistApi(bookId)
        await invalidateWishlist()
    }

    return {
        wishlist: query.data,
        isLoading: query.isLoading,
        addToWishlist,
        removeFromWishlist,
    }
}
