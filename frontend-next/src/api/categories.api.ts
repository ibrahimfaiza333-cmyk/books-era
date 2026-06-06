import api, { unwrapData } from "./client"
import type { Category } from "../types"

export interface CategoryFormPayload {
    name: string
    description?: string
    image?: File | null
    isActive?: boolean
}

export async function getCategories(): Promise<Category[]> {
    return unwrapData(api.get("/categories"))
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

export async function createCategory(payload: CategoryFormPayload): Promise<Category> {
    const formData = objectToFormData(payload)
    return unwrapData(api.post("/categories", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    }))
}

export async function updateCategory(id: string, payload: CategoryFormPayload): Promise<Category> {
    const formData = objectToFormData(payload)
    return unwrapData(api.patch(`/categories/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    }))
}

export async function deleteCategory(id: string): Promise<void> {
    await unwrapData(api.delete(`/categories/${id}`))
}
