import { keepPreviousData, useQuery } from "@tanstack/react-query"
import {
    getBooks,
    getBookById,
    getFeaturedBooks,
    getBestsellers,
    getReviewsByBookId,
    type BooksListParams,
} from "../api/books.api"
import { queryKeys } from "../lib/query-keys"

export function useBooksList(
    search: string,
    category: string,
    language: string,
    sortBy: string,
    sortOrder: string,
    page: number,
    limit: number
) {
    return useQuery({
        queryKey: queryKeys.books(search, category, language, sortBy, sortOrder, page),
        placeholderData: keepPreviousData,
        queryFn: () =>
            getBooks({
                search: search || undefined,
                category: category || undefined,
                language: language || undefined,
                sortBy,
                sortOrder,
                page,
                limit,
            } satisfies BooksListParams),
    })
}

export function useBookDetail(id: string | undefined) {
    return useQuery({
        queryKey: queryKeys.book(id),
        queryFn: () => getBookById(id!),
        enabled: !!id,
    })
}

export function useFeaturedBooks() {
    return useQuery({
        queryKey: queryKeys.featuredBooks,
        queryFn: getFeaturedBooks,
    })
}

export function useBestsellers() {
    return useQuery({
        queryKey: queryKeys.bestsellers,
        queryFn: getBestsellers,
    })
}

export function useBookReviews(bookId: string | undefined) {
    return useQuery({
        queryKey: queryKeys.reviews(bookId),
        queryFn: () => getReviewsByBookId(bookId!),
        enabled: !!bookId,
    })
}
