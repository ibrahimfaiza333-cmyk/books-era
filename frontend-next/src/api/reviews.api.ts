import client from "./client"

export const addReview = async (bookId: string, data: { rating: number, comment?: string }) => {
    const response = await client.post(`/reviews/${bookId}`, data)
    return response.data.data
}

export const getBookReviews = async (bookId: string, page = 1, limit = 10) => {
    const response = await client.get(`/reviews/${bookId}?page=${page}&limit=${limit}`)
    return response.data.data
}
