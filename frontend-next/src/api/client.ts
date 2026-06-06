import axios from "axios"
import type { InternalAxiosRequestConfig } from "axios"
import type { ApiResponse } from "../types"

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1",
    withCredentials: true,
})

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("accessToken")
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
        }
        return config
    },
    (error) => Promise.reject(error)
)

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            if (typeof window !== "undefined") {
                localStorage.removeItem("accessToken")
                window.location.href = "/login"
            }
        }
        return Promise.reject(error)
    }
)

/** Unwraps the standard `{ data: T }` envelope from API responses. */
export async function unwrapData<T>(
    request: Promise<{ data: ApiResponse<T> }>
): Promise<T> {
    const { data } = await request
    return data.data
}

export default api
