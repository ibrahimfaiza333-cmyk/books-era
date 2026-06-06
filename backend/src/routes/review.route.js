// routes/review.route.js
import { Router } from "express"
import {
    addReview,
    getBookReviews,
    updateReview,
    deleteReview
} from "../controllers/review.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

// Public
router.get("/:bookId", getBookReviews)

// Protected
router.post("/:bookId",        verifyJWT, addReview)
router.patch("/:reviewId",     verifyJWT, updateReview)
router.delete("/:reviewId",    verifyJWT, deleteReview)

export default router