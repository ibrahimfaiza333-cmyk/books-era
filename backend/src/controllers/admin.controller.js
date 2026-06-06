// controllers/admin.controller.js
import { asyncHandler } from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"
import { Book } from "../models/books.model.js"
import { Order } from "../models/order.model.js"
import { Category } from "../models/category.model.js"
import { Coupon } from "../models/coupon.model.js"
import { Review } from "../models/review.model.js"
import { Notification } from "../models/notification.model.js"

// ─── Dashboard ────────────────────────────────────────────────────

// GET /api/v1/admin/dashboard/stats
const getDashboardStats = asyncHandler(async (req, res) => {

    const [
        totalUsers,
        totalBooks,
        totalOrders,
        totalCategories,
        recentOrders,
        orderStats,
        lowStockBooks
    ] = await Promise.all([

        // Total users
        User.countDocuments({ role: "user" }),

        // Total books
        Book.countDocuments({ isActive: true }),

        // Total orders
        Order.countDocuments(),

        // Total categories
        Category.countDocuments({ isActive: true }),

        // Recent 5 orders
        Order.find()
            .populate("user", "fullName email phone")
            .sort({ createdAt: -1 })
            .limit(5),

        // Revenue stats
        Order.aggregate([
            {
                $match: {
                    orderStatus: { $ne: "cancelled" }
                }
            },
            {
                $group: {
                    _id:          null,
                    totalRevenue: { $sum: "$finalAmount" },
                    avgOrder:     { $avg: "$finalAmount" },
                    totalOrders:  { $sum: 1 }
                }
            }
        ]),

        // Low stock books (stock < 5)
        Book.find({ stock: { $lt: 5 }, isActive: true })
            .select("title stock")
            .limit(5)
    ])

    return res.status(200).json(
        new ApiResponse(200, {
            stats: {
                totalUsers,
                totalBooks,
                totalOrders,
                totalCategories,
                totalRevenue:  Math.round(orderStats[0]?.totalRevenue || 0),
                avgOrderValue: Math.round(orderStats[0]?.avgOrder     || 0)
            },
            recentOrders,
            lowStockBooks
        }, "Dashboard stats fetched successfully")
    )
})

// GET /api/v1/admin/dashboard/sales-chart
const getSalesChart = asyncHandler(async (req, res) => {

    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const salesData = await Order.aggregate([
        {
            $match: {
                createdAt:   { $gte: sixMonthsAgo },
                orderStatus: { $ne: "cancelled" }
            }
        },
        {
            $group: {
                _id: {
                    month: { $month: "$createdAt" },
                    year:  { $year:  "$createdAt" }
                },
                totalSales:  { $sum: "$finalAmount" },
                totalOrders: { $sum: 1 }
            }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
    ])

    return res.status(200).json(
        new ApiResponse(200, salesData, "Sales chart fetched successfully")
    )
})

// GET /api/v1/admin/dashboard/recent-orders
const getRecentOrders = asyncHandler(async (req, res) => {

    const orders = await Order.find()
        .populate("user", "fullName email phone")
        .sort({ createdAt: -1 })
        .limit(10)

    return res.status(200).json(
        new ApiResponse(200, orders, "Recent orders fetched successfully")
    )
})

// ─── Users Management ─────────────────────────────────────────────

// GET /api/v1/admin/users
const getAllUsers = asyncHandler(async (req, res) => {
    const {
        page     = 1,
        limit    = 10,
        search,
        role,
        isActive
    } = req.query

    const filter = {}

    if (role) filter.role = role

    if (isActive !== undefined) {
        filter.isActive = isActive === "true"
    }

    if (search) {
        filter.$or = [
            { fullName: { $regex: search, $options: "i" } },
            { email:    { $regex: search, $options: "i" } },
            { username: { $regex: search, $options: "i" } },
            { phone:    { $regex: search, $options: "i" } }
        ]
    }

    const skip = (Number(page) - 1) * Number(limit)

    const [users, total] = await Promise.all([
        User.find(filter)
            .select("-password -refreshToken")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit)),
        User.countDocuments(filter)
    ])

    return res.status(200).json(
        new ApiResponse(200, {
            users,
            total,
            page:       Number(page),
            totalPages: Math.ceil(total / Number(limit))
        }, "Users fetched successfully")
    )
})

// GET /api/v1/admin/users/:id
const getUserById = asyncHandler(async (req, res) => {

    const user = await User.findById(req.params.id)
        .select("-password -refreshToken")

    if (!user) throw new ApiError(404, "User not found")

    // User ke orders
    const orders = await Order.find({ user: req.params.id })
        .sort({ createdAt: -1 })
        .limit(5)

    // User ka total spend
    const spendData = await Order.aggregate([
        {
            $match: {
                user:        user._id,
                orderStatus: { $ne: "cancelled" }
            }
        },
        {
            $group: {
                _id:        null,
                totalSpend: { $sum: "$finalAmount" },
                totalOrders:{ $sum: 1 }
            }
        }
    ])

    return res.status(200).json(
        new ApiResponse(200, {
            user,
            recentOrders: orders,
            stats: {
                totalSpend:  spendData[0]?.totalSpend  || 0,
                totalOrders: spendData[0]?.totalOrders || 0
            }
        }, "User fetched successfully")
    )
})

// PATCH /api/v1/admin/users/:id/ban
const toggleUserBan = asyncHandler(async (req, res) => {

    const user = await User.findById(req.params.id)
    if (!user) throw new ApiError(404, "User not found")

    // Admin ko ban nahi kar sakte
    if (user.role === "admin") {
        throw new ApiError(400, "Admin cant be banned!")
    }

    // Apne aap ko ban nahi kar sakte
    if (user._id.toString() === req.user._id.toString()) {
        throw new ApiError(400, "you can't ban yourself!")
    }

    user.isActive = !user.isActive
    await user.save()

    return res.status(200).json(
        new ApiResponse(200, {
            isActive: user.isActive,
            message:  user.isActive ? "User unbanned" : "User banned"
        }, `User ${user.isActive ? "unbanned" : "baned"} successfully`)
    )
})

// DELETE /api/v1/admin/users/:id
const deleteUser = asyncHandler(async (req, res) => {

    const user = await User.findById(req.params.id)
    if (!user) throw new ApiError(404, "User not found")

    if (user.role === "admin") {
        throw new ApiError(400, "Admin ko delete nahi kar sakte!")
    }

    if (user._id.toString() === req.user._id.toString()) {
        throw new ApiError(400, "Apne aap ko delete nahi kar sakte!")
    }

    await User.findByIdAndDelete(req.params.id)

    return res.status(200).json(
        new ApiResponse(200, {}, "User deleted")
    )
})

// ─── Orders Management ────────────────────────────────────────────

// GET /api/v1/admin/orders
const getAllOrdersAdmin = asyncHandler(async (req, res) => {
    const {
        page          = 1,
        limit         = 10,
        orderStatus,
        paymentStatus,
        paymentMethod,
        search
    } = req.query

    const filter = {}
    if (orderStatus)   filter.orderStatus   = orderStatus
    if (paymentStatus) filter.paymentStatus = paymentStatus
    if (paymentMethod) filter.paymentMethod = paymentMethod

    const skip = (Number(page) - 1) * Number(limit)

    const [orders, total] = await Promise.all([
        Order.find(filter)
            .populate("user", "fullName email phone")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit)),
        Order.countDocuments(filter)
    ])

    return res.status(200).json(
        new ApiResponse(200, {
            orders,
            total,
            page:       Number(page),
            totalPages: Math.ceil(total / Number(limit))
        }, "All orders fetched successfully")
    )
})

// GET /api/v1/admin/orders/:id
const getOrderByIdAdmin = asyncHandler(async (req, res) => {

    const order = await Order.findById(req.params.id)
        .populate("user",       "fullName email phone addresses")
        .populate("items.book", "title thumbnail author")

    if (!order) throw new ApiError(404, "Order not found")

    return res.status(200).json(
        new ApiResponse(200, order, "Order fetched successfully")
    )
})

// PATCH /api/v1/admin/orders/:id/status
const updateOrderStatusAdmin = asyncHandler(async (req, res) => {
    const { orderStatus } = req.body

    const validStatuses = [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled"
    ]

    if (!validStatuses.includes(orderStatus)) {
        throw new ApiError(400, "Invalid order status")
    }

    const order = await Order.findById(req.params.id)
    if (!order) throw new ApiError(404, "Order not found")

    // Already cancelled order ko update mat karo
    if (order.orderStatus === "cancelled") {
        throw new ApiError(400, "Cancelled order van;t be updated")
    }

    order.orderStatus = orderStatus

    // Delivered hone pe payment mark karo
    if (orderStatus === "delivered") {
        order.isDelivered   = true
        order.deliveredAt   = new Date()
        order.paymentStatus = "paid"
        order.isPaid        = true
        order.paidAt        = new Date()
    }

    // Admin cancel kare toh stock wapas karo
    if (orderStatus === "cancelled") {
        for (const item of order.items) {
            await Book.findByIdAndUpdate(
                item.book,
                { $inc: { stock: item.quantity } }
            )
        }
        order.cancelledAt  = new Date()
        order.cancelReason = "Admin cancelled"
    }

    await order.save()

    // ✅ Status-specific Notification Messages
    const statusMessages = {
        pending:    `🕐 Your order #${order.orderNumber} has been placed and is pending confirmation.`,
        confirmed:  `✅ Great news! Your order #${order.orderNumber} has been confirmed.`,
        processing: `📦 Your order #${order.orderNumber} is currently being packed and processed.`,
        shipped:    `🚚 Your order #${order.orderNumber} is on its way! It has been shipped.`,
        delivered:  `🎉 Your order #${order.orderNumber} has been delivered successfully. Enjoy your books!`,
        cancelled:  `❌ Your order #${order.orderNumber} has been cancelled. For help, contact our support.`
    }

    try {
        await Notification.create({
            user: order.user,
            message: statusMessages[orderStatus] || `Order Update: Your order #${order.orderNumber} status is now '${orderStatus}'.`,
            type: "order"
        })
    } catch (notifErr) {
        console.error("Error creating status update notification in admin:", notifErr)
    }

    return res.status(200).json(
        new ApiResponse(200, order, "Order status updated")
    )
})

// ─── Books Management ─────────────────────────────────────────────

// GET /api/v1/admin/books
const getAllBooksAdmin = asyncHandler(async (req, res) => {
    const {
        page     = 1,
        limit    = 10,
        search,
        isActive,
        category
    } = req.query

    const filter = {}

    if (isActive !== undefined) {
        filter.isActive = isActive === "true"
    }
    if (category) filter.category = category
    if (search) {
        filter.$or = [
            { title:  { $regex: search, $options: "i" } },
            { author: { $regex: search, $options: "i" } },
            { isbn:   { $regex: search, $options: "i" } }
        ]
    }

    const skip = (Number(page) - 1) * Number(limit)

    const [books, total] = await Promise.all([
        Book.find(filter)
            .populate("category", "name")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit)),
        Book.countDocuments(filter)
    ])

    return res.status(200).json(
        new ApiResponse(200, {
            books,
            total,
            page:       Number(page),
            totalPages: Math.ceil(total / Number(limit))
        }, "Books fetched successfully")
    )
})

// PATCH /api/v1/admin/books/:id/toggle-active
const toggleBookActive = asyncHandler(async (req, res) => {

    const book = await Book.findById(req.params.id)
    if (!book) throw new ApiError(404, "Book not found")

    book.isActive = !book.isActive
    await book.save()

    return res.status(200).json(
        new ApiResponse(200, {
            isActive: book.isActive
        }, `Book ${book.isActive ? "active" : "inactive"} done!`)
    )
})

// ─── Categories Management ────────────────────────────────────────

// PATCH /api/v1/admin/categories/:id/toggle
const toggleCategoryActive = asyncHandler(async (req, res) => {

    const category = await Category.findById(req.params.id)
    if (!category) throw new ApiError(404, "Category not found")

    category.isActive = !category.isActive
    await category.save()

    return res.status(200).json(
        new ApiResponse(200, {
            isActive: category.isActive
        }, `Category ${category.isActive ? "active" : "inactive"} done!`)
    )
})

// ─── Reviews Management ───────────────────────────────────────────

// GET /api/v1/admin/reviews
const getAllReviews = asyncHandler(async (req, res) => {
    const {
        page  = 1,
        limit = 10,
        rating
    } = req.query

    const filter = {}
    if (rating) filter.rating = Number(rating)

    const skip = (Number(page) - 1) * Number(limit)

    const [reviews, total] = await Promise.all([
        Review.find(filter)
            .populate("user", "fullName email")
            .populate("book", "title thumbnail")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit)),
        Review.countDocuments(filter)
    ])

    return res.status(200).json(
        new ApiResponse(200, {
            reviews,
            total,
            page:       Number(page),
            totalPages: Math.ceil(total / Number(limit))
        }, "Reviews fetched successfully")
    )
})

// DELETE /api/v1/admin/reviews/:id
const deleteReviewAdmin = asyncHandler(async (req, res) => {

    const review = await Review.findByIdAndDelete(req.params.id)
    if (!review) throw new ApiError(404, "Review not found")

    return res.status(200).json(
        new ApiResponse(200, {}, "Review deleted")
    )
})

// ─── Sales Report ─────────────────────────────────────────────────

// GET /api/v1/admin/sales-report
const getSalesReport = asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query

    const filter = { orderStatus: { $ne: "cancelled" } }

    if (startDate || endDate) {
        filter.createdAt = {}
        if (startDate) filter.createdAt.$gte = new Date(startDate)
        if (endDate)   filter.createdAt.$lte = new Date(endDate)
    }

    const [
        overview,
        topBooks,
        paymentMethods,
        ordersByStatus
    ] = await Promise.all([

        // Overview
        Order.aggregate([
            { $match: filter },
            {
                $group: {
                    _id:          null,
                    totalRevenue: { $sum: "$finalAmount" },
                    totalOrders:  { $sum: 1 },
                    avgOrder:     { $avg: "$finalAmount" },
                    totalDiscount:{ $sum: "$discount" }
                }
            }
        ]),

        // Top 5 books
        Order.aggregate([
            { $match: filter },
            { $unwind: "$items" },
            {
                $group: {
                    _id:       "$items.book",
                    title:     { $first: "$items.title" },
                    totalSold: { $sum: "$items.quantity" },
                    revenue:   {
                        $sum: {
                            $multiply: ["$items.price", "$items.quantity"]
                        }
                    }
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: 5 }
        ]),

        // Payment methods
        Order.aggregate([
            { $match: filter },
            {
                $group: {
                    _id:   "$paymentMethod",
                    count: { $sum: 1 },
                    total: { $sum: "$finalAmount" }
                }
            }
        ]),

        // Orders by status
        Order.aggregate([
            {
                $group: {
                    _id:   "$orderStatus",
                    count: { $sum: 1 }
                }
            }
        ])
    ])

    return res.status(200).json(
        new ApiResponse(200, {
            overview: {
                totalRevenue:  Math.round(overview[0]?.totalRevenue  || 0),
                totalOrders:   overview[0]?.totalOrders   || 0,
                avgOrder:      Math.round(overview[0]?.avgOrder      || 0),
                totalDiscount: Math.round(overview[0]?.totalDiscount || 0)
            },
            topBooks,
            paymentMethods,
            ordersByStatus
        }, "Sales report fetched successfully")
    )
})

// ─── Exports ──────────────────────────────────────────────────────

export {
    // Dashboard
    getDashboardStats,
    getSalesChart,
    getRecentOrders,
    // Users
    getAllUsers,
    getUserById,
    toggleUserBan,
    deleteUser,
    // Orders
    getAllOrdersAdmin,
    getOrderByIdAdmin,
    updateOrderStatusAdmin,
    // Books
    getAllBooksAdmin,
    toggleBookActive,
    // Categories
    toggleCategoryActive,
    // Reviews
    getAllReviews,
    deleteReviewAdmin,
    // Reports
    getSalesReport
}