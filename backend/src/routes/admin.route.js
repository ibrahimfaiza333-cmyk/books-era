// routes/admin.route.js
import { Router } from "express"
import {
    getDashboardStats,
    getSalesChart,
    getRecentOrders,
    getAllUsers,
    getUserById,
    toggleUserBan,
    deleteUser,
    getAllOrdersAdmin,
    getOrderByIdAdmin,
    updateOrderStatusAdmin,
    getAllBooksAdmin,
    toggleBookActive,
    toggleCategoryActive,
    getAllReviews,
    deleteReviewAdmin,
    getSalesReport
} from "../controllers/admin.controller.js"
import { verifyJWT }   from "../middlewares/auth.middleware.js"
import { verifyAdmin } from "../middlewares/admin.middleware.js"

const router = Router()

// Sab routes pe dono middlewares
router.use(verifyJWT, verifyAdmin)

// ── Dashboard ─────────────────────────────────────────
router.get("/dashboard/stats",         getDashboardStats)
router.get("/dashboard/sales-chart",   getSalesChart)
router.get("/dashboard/recent-orders", getRecentOrders)

// ── Users ─────────────────────────────────────────────
router.get("/users",             getAllUsers)
router.get("/users/:id",         getUserById)
router.patch("/users/:id/ban",   toggleUserBan)
router.delete("/users/:id",      deleteUser)

// ── Orders ────────────────────────────────────────────
router.get("/orders",                getAllOrdersAdmin)
router.get("/orders/:id",            getOrderByIdAdmin)//not checkedd
router.patch("/orders/:id/status",   updateOrderStatusAdmin)//not checked

// ── Books ─────────────────────────────────────────────
router.get("/books",                      getAllBooksAdmin)
router.patch("/books/:id/toggle-active",  toggleBookActive)//not checked

// ── Categories ────────────────────────────────────────
router.patch("/categories/:id/toggle", toggleCategoryActive)//not checked

// ── Reviews ───────────────────────────────────────────
router.get("/reviews",         getAllReviews)
router.delete("/reviews/:id",  deleteReviewAdmin)

// ── Reports ───────────────────────────────────────────
router.get("/sales-report", getSalesReport)

export default router