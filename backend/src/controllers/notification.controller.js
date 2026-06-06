import { Notification } from "../models/notification.model.js"
import { User } from "../models/user.model.js"
import ApiError from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

// Get all notifications for logged in user
const getNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ user: req.user._id })
        .sort("-createdAt")
        .limit(20) // Get the latest 20 notifications

    return res.status(200).json(
        new ApiResponse(200, notifications, "Notifications fetched successfully")
    )
})

// Mark single notification as read
const markAsRead = asyncHandler(async (req, res) => {
    const { id } = req.params

    const notification = await Notification.findOneAndUpdate(
        { _id: id, user: req.user._id },
        { isRead: true },
        { new: true }
    )

    if (!notification) {
        throw new ApiError(404, "Notification not found")
    }

    return res.status(200).json(
        new ApiResponse(200, notification, "Notification marked as read")
    )
})

// Mark all notifications as read
const markAllAsRead = asyncHandler(async (req, res) => {
    await Notification.updateMany(
        { user: req.user._id, isRead: false },
        { isRead: true }
    )

    return res.status(200).json(
        new ApiResponse(200, {}, "All notifications marked as read")
    )
})

// Admin — Broadcast notification to ALL users
const broadcastNotification = asyncHandler(async (req, res) => {
    const { message } = req.body

    if (!message || !message.trim()) {
        throw new ApiError(400, "Message is required")
    }

    // Get all active users
    const users = await User.find({ isActive: true }).select("_id")

    if (users.length === 0) {
        return res.status(200).json(
            new ApiResponse(200, {}, "No users found to notify")
        )
    }

    const notifications = users.map(u => ({
        user: u._id,
        message: message.trim(),
        type: "promo"
    }))

    await Notification.insertMany(notifications)

    return res.status(200).json(
        new ApiResponse(200, { sentTo: users.length }, `Notification sent to ${users.length} users successfully`)
    )
})

export { getNotifications, markAsRead, markAllAsRead, broadcastNotification }
