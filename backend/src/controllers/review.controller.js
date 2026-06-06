
import { asyncHandler } from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Review } from "../models/review.model.js"
import { Order } from "../models/order.model.js"
import { Book } from "../models/books.model.js"
import { User } from "../models/user.model.js"
import { Notification } from "../models/notification.model.js"


// POST /api/v1/reviews/:bookId
const addReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body
    const { bookId } = req.params

    if (!rating) {
        throw new ApiError(400, "Rating is required")
    }

    if (rating < 1 || rating > 5) {
        throw new ApiError(400, "Rating must be between 1 and 5")
    }

    // Check if book exists
    const book = await Book.findById(bookId)

    if (!book) {
        throw new ApiError(404, "Book not found")
    }

    // Check if user already reviewed this book
    const existingReview = await Review.findOne({
        user: req.user._id,
        book: bookId
    })

    if (existingReview) {
        throw new ApiError(400, "You have already reviewed this book")
    }

    // Check verified purchase
    const hasPurchased = await Order.findOne({
        user: req.user._id,
        "items.book": bookId,
        orderStatus: "delivered"
    })
    if (!hasPurchased) {
    throw new ApiError(
        403,
        "You can only review books you have purchased"
    )
}

    const review = await Review.create({
        user: req.user._id,
        book: bookId,
        rating,
        comment: comment || "",
        isVerifiedPurchase: !!hasPurchased
    })

    await review.populate("user", "fullName avatar")

    // ✅ Notify Admins about new review
    try {
        const admins = await User.find({ role: "admin" }).select("_id")
        if (admins.length > 0) {
            const adminNotifications = admins.map(admin => ({
                user: admin._id,
                message: `New ${rating}⭐ review submitted by ${req.user.fullName} for the book '${book.title}'.`,
                type: "system"
            }))
            await Notification.insertMany(adminNotifications)
        }
    } catch (notifErr) {
        console.error("Error creating admin notification for new review:", notifErr)
    }

    return res.status(201).json(
        new ApiResponse(
            201,
            review,
            "Review added successfully"
        )
    )
})


// GET /api/v1/reviews/:bookId
const getBookReviews = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query
    const { bookId } = req.params

    const skip = (Number(page) - 1) * Number(limit)

    const [reviews, total] = await Promise.all([
        Review.find({ book: bookId })
            .populate("user", "fullName avatar")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit)),

        Review.countDocuments({ book: bookId })
    ])

    // Rating breakdown
    const ratingBreakdown = await Review.aggregate([
        {
            $match: {
                book: bookId
            }
        },
        {
            $group: {
                _id: "$rating",
                count: { $sum: 1 }
            }
        },
        {
            $sort: {
                _id: -1
            }
        }
    ])

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                reviews,
                total,
                page: Number(page),
                totalPages: Math.ceil(total / Number(limit)),
                ratingBreakdown
            },
            "Reviews fetched successfully"
        )
    )
})


// PATCH /api/v1/reviews/:reviewId
const updateReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body

    if (rating && (rating < 1 || rating > 5)) {
        throw new ApiError(400, "Rating must be between 1 and 5")
    }

    const review = await Review.findOne({
        _id: req.params.reviewId,
        user: req.user._id
    })

    if (!review) {
        throw new ApiError(404, "Review not found")
    }

    if (rating) {
        review.rating = rating
    }

    if (comment) {
        review.comment = comment
    }

    await review.save()

    return res.status(200).json(
        new ApiResponse(
            200,
            review,
            "Review updated successfully"
        )
    )
})


// DELETE /api/v1/reviews/:reviewId
const deleteReview = asyncHandler(async (req, res) => {

    const review = await Review.findOneAndDelete({
        _id: req.params.reviewId,
        user: req.user._id
    })

    if (!review) {
        throw new ApiError(404, "Review not found")
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Review deleted successfully"
        )
    )
})


export {
    addReview,
    getBookReviews,
    updateReview,
    deleteReview
}