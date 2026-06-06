import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { verifyAdmin } from "../middlewares/admin.middleware.js"
import {
    getNotifications,
    markAsRead,
    markAllAsRead,
    broadcastNotification
} from "../controllers/notification.controller.js"

const router = Router()

// All notification routes must be protected
router.use(verifyJWT)

router.route("/").get(getNotifications)
router.route("/read-all").put(markAllAsRead)
router.route("/:id/read").put(markAsRead)

// Admin only — broadcast to all users
router.route("/broadcast").post(verifyAdmin, broadcastNotification)

export default router
