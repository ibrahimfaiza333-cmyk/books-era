import { Router } from "express"
import {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist
} from "../controllers/wishlist.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.use(verifyJWT)

router.get("/",              getWishlist)
router.post("/:bookId",      addToWishlist)
router.delete("/clear",      clearWishlist)
router.delete("/:bookId",    removeFromWishlist)

export default router