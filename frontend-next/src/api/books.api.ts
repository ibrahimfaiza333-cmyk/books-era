import api, { unwrapData } from "./client"
import type { Book, Review } from "../types"

export interface BooksListParams {
    search?: string
    category?: string
    language?: string
    sortBy: string
    sortOrder: string
    page: number
    limit: number
}

export interface BooksListResult {
    books: Book[]
    total: number
    page: number
    totalPages: number
}

export interface ReviewsResult {
    reviews: Review[]
}

export interface BookFormPayload {
    title: string
    description: string
    author: string
    publisher: string
    category: string
    price: number
    originalPrice: number
    stock: number
    pages: number
    language: string
    isbn: string
    isFeatured: boolean
    isBestseller: boolean
    coverImage?: File | null
}

export async function getBooks(params: BooksListParams): Promise<BooksListResult> {
    const searchParams = new URLSearchParams()
    if (params.search) searchParams.set("search", params.search)
    if (params.category) searchParams.set("category", params.category)
    if (params.language) searchParams.set("language", params.language)
    searchParams.set("sortBy", params.sortBy)
    searchParams.set("sortOrder", params.sortOrder)
    searchParams.set("page", String(params.page))
    searchParams.set("limit", String(params.limit))
    return unwrapData(api.get(`/books?${searchParams}`))
}

export async function getBookById(id: string): Promise<Book> {
    return unwrapData(api.get(`/books/${id}`))
}

export async function getFeaturedBooks(): Promise<Book[]> {
    return unwrapData(api.get("/books/featured"))
}

export async function getBestsellers(): Promise<Book[]> {
    return unwrapData(api.get("/books/bestsellers"))
}

export async function getReviewsByBookId(bookId: string): Promise<ReviewsResult> {
    return unwrapData(api.get(`/reviews/${bookId}`))
}

function objectToFormData(obj: any): FormData {
    const formData = new FormData()
    for (const key in obj) {
        if (obj[key] !== undefined && obj[key] !== null) {
            formData.append(key, obj[key] instanceof File ? obj[key] : String(obj[key]))
        }
    }
    return formData
}

export async function createBook(payload: BookFormPayload): Promise<void> {
    const formData = objectToFormData(payload)
    await unwrapData(api.post("/books", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    }))
}

export async function updateBook(id: string, payload: BookFormPayload): Promise<void> {
    const formData = objectToFormData(payload)
    await unwrapData(api.patch(`/books/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    }))
}

export async function deleteBook(id: string): Promise<void> {
    await unwrapData(api.delete(`/books/${id}`))
}
