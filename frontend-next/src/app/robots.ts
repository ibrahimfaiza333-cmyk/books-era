import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: ["/", "/books", "/books/*", "/register", "/login"],
                disallow: [
                    "/admin",
                    "/admin/*",
                    "/cart",
                    "/checkout",
                    "/profile",
                    "/orders",
                    "/orders/*",
                    "/wishlist",
                    "/forgot-password",
                    "/reset-password/*",
                ],
            },
            {
                // Block AI bots from crawling
                userAgent: ["GPTBot", "ChatGPT-User", "CCBot", "anthropic-ai"],
                disallow: ["/"],
            }
        ],
        sitemap: "https://sulemanbooks.com/sitemap.xml",
        host: "https://sulemanbooks.com",
    }
}
