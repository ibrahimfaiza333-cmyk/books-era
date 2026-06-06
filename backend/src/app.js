import express from "express"
import cors from "cors"
import morgan from "morgan"
import cookieParser from "cookie-parser"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
// import mongoSanitize from "express-mongo-sanitize"
// import xss from "xss-clean"

const app = express()

// ─── Security ────────────────────────────────────────

// 1. Helmet
app.use(helmet())

// 2. CORS
const allowedOrigins = [
    process.env.CORS_ORIGIN,
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))

// 3. Morgan - development mein logs
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"))
}

// 4. Body parsers
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

// 5. MongoDB injection band
// app.use(mongoSanitize())

// 6. XSS band
// app.use(xss())

// ─── Rate Limiting ────────────────────────────────────

// Global limiter
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3000, // Safe limit for production to avoid 429 errors
    message: {
        success: false,
        message: "Too many requests - 15 min baad try karo"
    }
})
app.use("/api", globalLimiter)

// Auth limiter - strict
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: "Too many attempts - 15 min baad try karo"
    }
})
app.use("/api/v1/users/login",           authLimiter)
app.use("/api/v1/users/register",        authLimiter)
app.use("/api/v1/users/forgot-password", authLimiter)

// ─── Routes ──────────────────────────────────────────

import userRouter     from "./routes/user.route.js"
import bookRouter     from "./routes/book.route.js"
import categoryRouter from "./routes/category.route.js"
import cartRouter     from "./routes/cart.route.js"
import orderRouter    from "./routes/order.route.js"
import couponRouter   from "./routes/coupon.route.js"
import reviewRouter from "./routes/review.route.js"
import wishlistRouter from "./routes/wishlist.route.js"
import adminRouter from "./routes/admin.route.js"
import newsletterRouter from "./routes/newsletter.route.js"
import notificationRouter from "./routes/notification.route.js"

app.use("/api/v1/users",      userRouter)
app.use("/api/v1/books",      bookRouter)
app.use("/api/v1/categories", categoryRouter)
app.use("/api/v1/cart",       cartRouter)
app.use("/api/v1/orders",     orderRouter)
app.use("/api/v1/coupons",    couponRouter)
app.use("/api/v1/reviews",    reviewRouter)
app.use("/api/v1/wishlist",  wishlistRouter)
app.use("/api/v1/admin", adminRouter)
app.use("/api/v1/newsletter", newsletterRouter)
app.use("/api/v1/notifications", notificationRouter)
// ─── Error Handler ───────────────────────────────────

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message    = err.message    || "Something went wrong"

    return res.status(statusCode).json({
        success: false,
        message,
        errors: err.errors || [],
        stack:  process.env.NODE_ENV === "development"
            ? err.stack
            : undefined
    })
})

export default app