export const dynamic = "force-dynamic"

import { MetadataRoute } from "next"

const BASE_URL = "https://sulemanbooks.com"
const API_URL  = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

    // ── 1. Static pages ──────────────────────────────────────────────
    const staticPages: MetadataRoute.Sitemap = [
        {
            url:              `${BASE_URL}/`,
            lastModified:     new Date(),
            changeFrequency:  "daily",
            priority:         1.0,
        },
        {
            url:              `${BASE_URL}/books`,
            lastModified:     new Date(),
            changeFrequency:  "daily",
            priority:         0.9,
        },
        {
            url:              `${BASE_URL}/login`,
            lastModified:     new Date(),
            changeFrequency:  "monthly",
            priority:         0.5,
        },
        {
            url:              `${BASE_URL}/register`,
            lastModified:     new Date(),
            changeFrequency:  "monthly",
            priority:         0.5,
        },
    ]

    // ── 2. Dynamic Book pages ─────────────────────────────────────────
    let bookPages: MetadataRoute.Sitemap = []

    try {
        const res  = await fetch(`${API_URL}/books?limit=500`, { cache: "no-store" })
        const json = await res.json()
        const books: { _id: string; updatedAt: string }[] = json?.data?.books || []

        bookPages = books.map((book) => ({
            url:             `${BASE_URL}/books/${book._id}`,
            lastModified:    new Date(book.updatedAt),
            changeFrequency: "weekly" as const,
            priority:        0.8,
        }))
    } catch (err) {
        console.error("Sitemap: Failed to fetch books", err)
    }

    return [...staticPages, ...bookPages]
}
