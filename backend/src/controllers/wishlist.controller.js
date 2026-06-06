// controllers/wishlist.controller.js
import { asyncHandler } from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"
import { Book } from "../models/books.model.js"

// GET /api/v1/wishlist
const getWishlist = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
        .populate(
            "wishlist",
            "title coverImage price originalPrice author ratingsAverage stock isActive"
        )

    return res.status(200).json(
        new ApiResponse(200, user.wishlist, "Wishlist fetched successfully")
    )
})

// POST /api/v1/wishlist/:bookId
const addToWishlist = asyncHandler(async (req, res) => {
    const { bookId } = req.params

    // Book exist check
    const book = await Book.findById(bookId)
    if (!book) throw new ApiError(404, "Book not found")

    const user = await User.findById(req.user._id)

    // Already in wishlist check
    if (user.wishlist.includes(bookId)) {
        throw new ApiError(400, "Book already in wishlist")
    }

    user.wishlist.push(bookId)
    await user.save()

    return res.status(200).json(
        new ApiResponse(200, {
            wishlistCount: user.wishlist.length
        }, "Book wishlist mein add ho gaya!")
    )
})

// DELETE /api/v1/wishlist/:bookId
const removeFromWishlist = asyncHandler(async (req, res) => {
    const { bookId } = req.params

    const user = await User.findById(req.user._id)

    // Check karo book wishlist mein hai
    if (!user.wishlist.includes(bookId)) {
        throw new ApiError(400, "Book not found in  wishlist ")
    }

    await User.findByIdAndUpdate(
        req.user._id,
        { $pull: { wishlist: bookId } }
    )

    return res.status(200).json(
        new ApiResponse(200, {}, "Book  removed from wishlist !")
    )
})

// DELETE /api/v1/wishlist/clear
const clearWishlist = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        { $set: { wishlist: [] } }
    )

    return res.status(200).json(
        new ApiResponse(200, {}, "Wishlist cleared!")
    )
})

export {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist
}