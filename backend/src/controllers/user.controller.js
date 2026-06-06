import { asyncHandler } from "../utils/asyncHandler.js"
import crypto from "crypto"
import { sendEmail, forgotPasswordEmail } from "../utils/sendEmail.js"
import { User } from "../models/user.model.js"
import { Notification } from "../models/notification.model.js"
import ApiError from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"

// ─── Constants ────────────────────────────────────────────────────────────────

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge:   7 * 24 * 60 * 60 * 1000,
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// ─── Helpers ──────────────────────────────────────────────────────────────────

const generateAccessAndRefreshToken = async (userId) => {
    const user = await User.findById(userId)
    if (!user) throw new ApiError(404, "User not found")

    const accessToken  = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    return { accessToken, refreshToken }
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

// POST /api/v1/users/register
const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, password, username, phone, address } = req.body

    // Required fields check
    if (!fullName || !email || !password || !username || !phone) {
        throw new ApiError(400, "All fields are required")
    }

    // Address check
    if (!address?.street || !address?.city || !address?.province) {
        throw new ApiError(400, "Street, city aur province required hain")
    }

    // Email format check
    if (!EMAIL_REGEX.test(email)) {
        throw new ApiError(400, "Invalid email format")
    }

    // Phone check
    if (String(phone).length !== 11) {
        throw new ApiError(400, "Phone number 11 digits ka hona chahiye")
    }

    // Password check
    if (password.length < 8) {
        throw new ApiError(400, "Password 8 characters se zyada hona chahiye")
    }

    // Existing user check
    const existingUser = await User.findOne({
        $or: [
            { email:    email.toLowerCase()    },
            { username: username.toLowerCase() }
        ]
    })

    if (existingUser) {
        const conflictField =
            existingUser.email === email.toLowerCase() ? "email" : "username"
        throw new ApiError(
            409,
            `An account with this ${conflictField} already exists`
        )
    }

    // User create karo
    const user = await User.create({
        fullName,
        email:    email.toLowerCase(),
        password,
        username: username.toLowerCase(),
        phone,
        addresses: [
            {
                fullName,
                phone,
                street:     address?.street     || "",
                city:       address?.city       || "",
                province:   address?.province   || "",
                postalCode: address?.postalCode || "",
                country:    address?.country    || "Pakistan",
                isDefault:  true
            }
        ]
    })

    const createdUser = await User.findById(user._id)
        .select("-password -refreshToken")

    if (!createdUser) {
        throw new ApiError(500, "User registration failed - please try again")
    }

    // ✅ Notify Admins about new user
    try {
        const admins = await User.find({ role: "admin" }).select("_id")
        if (admins.length > 0) {
            const adminNotifications = admins.map(admin => ({
                user: admin._id,
                message: `New User Registered: ${createdUser.fullName} (${createdUser.email}).`,
                type: "system"
            }))
            await Notification.insertMany(adminNotifications)
        }
    } catch (notifErr) {
        console.error("Error creating admin notification for new user:", notifErr)
    }

    return res
        .status(201)
        .json(new ApiResponse(201, createdUser, "User registered successfully"))
})

// POST /api/v1/users/login
const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body

    if ((!email && !username) || !password) {
        throw new ApiError(400, "Email or username, and password are required")
    }

    const user = await User.findOne({
        $or: [
            ...(email    ? [{ email:    email.toLowerCase()    }] : []),
            ...(username ? [{ username: username.toLowerCase() }] : [])
        ]
    })

    if (!user) {
        throw new ApiError(404, "No account found - please register first")
    }

    // Active check
    if (!user.isActive) {
        throw new ApiError(403, "Aapka account ban kar diya gaya hai")
    }

    // Password check
    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials")
    }

    const { accessToken, refreshToken } =
        await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id)
        .select("-password -refreshToken")

    return res
        .status(200)
        .cookie("accessToken",  accessToken,  COOKIE_OPTIONS)
        .cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
        .json(new ApiResponse(200, {
            user: loggedInUser,
            accessToken
        }, "Logged in successfully"))
})

// POST /api/v1/users/logout
const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        { $unset: { refreshToken: 1 } },
        { new: true }
    )

    return res
        .status(200)
        .clearCookie("accessToken",  COOKIE_OPTIONS)
        .clearCookie("refreshToken", COOKIE_OPTIONS)
        .json(new ApiResponse(200, {}, "Logged out successfully"))
})

// POST /api/v1/users/refresh-token
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
        req.cookies?.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Refresh token required")
    }

    // Token verify karo
    let decodedToken
    try {
        decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    } catch {
        throw new ApiError(401, "Invalid or expired refresh token")
    }

    // User dhundo
    const user = await User.findById(decodedToken._id)

    if (!user) {
        throw new ApiError(401, "User not found")
    }

    if (!user.isActive) {
        throw new ApiError(403, "Aapka account ban kar diya gaya hai")
    }

    if (user.refreshToken !== incomingRefreshToken) {
        throw new ApiError(401, "Refresh token mismatch - please login again")
    }

    // New tokens banao
    const { accessToken, refreshToken: newRefreshToken } =
        await generateAccessAndRefreshToken(user._id)

    return res
        .status(200)
        .cookie("accessToken",  accessToken,     COOKIE_OPTIONS)
        .cookie("refreshToken", newRefreshToken,  COOKIE_OPTIONS)
        .json(new ApiResponse(200, { accessToken }, "Token refreshed successfully"))
})

// POST /api/v1/users/change-password
const changeUserPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body

    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "Both passwords are required")
    }

    if (newPassword.length < 8) {
        throw new ApiError(400, "Password 8 characters se zyada hona chahiye")
    }

    if (oldPassword === newPassword) {
        throw new ApiError(400, "New password old password se alag hona chahiye")
    }

    const user = await User.findById(req.user?._id)
    if (!user) throw new ApiError(404, "User not found")

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Incorrect old password")
    }

    user.password = newPassword
    await user.save()

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"))
})

// GET /api/v1/users/current-user
const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "User fetched successfully"))
})

// POST /api/v1/users/forgot-password
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body

    if (!email) {
        throw new ApiError(400, "Email required hai")
    }

    if (!EMAIL_REGEX.test(email)) {
        throw new ApiError(400, "Invalid email format")
    }

    const user = await User.findOne({ email: email.toLowerCase() })

    if (!user) {
        return res.status(200).json(
            new ApiResponse(200, {}, "If email is registered, reset link has been sent")
        )
    }

    const resetToken = crypto.randomBytes(32).toString("hex")

    user.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex")

    user.resetPasswordExpiry = new Date(Date.now() + 15 * 60 * 1000)
    await user.save({ validateBeforeSave: false })

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`

    // ✅ Email bhejo - uncomment karo!
    await sendEmail(
        user.email,
        "Password Reset - Suleman Book Store",
        forgotPasswordEmail(resetUrl)
    )

    return res.status(200).json(
        new ApiResponse(200, {}, "Password reset email sent successfully!")
        // ✅ resetUrl hatao response se - security risk!
    )
})

// POST /api/v1/users/reset-password/:token
const resetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params
    const { newPassword } = req.body

    if (!newPassword) {
        throw new ApiError(400, "New password required hai")
    }

    if (newPassword.length < 8) {
        throw new ApiError(400, "Password 8 characters se zyada hona chahiye")
    }

    // Token hash karo
    const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex")

    // User dhundo valid token se
    const user = await User.findOne({
        resetPasswordToken:  hashedToken,
        resetPasswordExpiry: { $gt: new Date() }
    })

    if (!user) {
        throw new ApiError(400, "Token invalid ya expire ho gaya hai")
    }

    // Password update karo
    user.password            = newPassword
    user.resetPasswordToken  = undefined
    user.resetPasswordExpiry = undefined
    await user.save()

    return res.status(200).json(
        new ApiResponse(200, {}, "Password reset ho gaya - ab login karo!")
    )
})

// ─── Profile ──────────────────────────────────────────────────────────────────

// PATCH /api/v1/users/update-profile
const updateProfile = asyncHandler(async (req, res) => {
    const { fullName, phone, username } = req.body

    if (!fullName && !phone && !username) {
        throw new ApiError(400, "At least one field is required")
    }

    const user = await User.findById(req.user._id)
    if (!user) throw new ApiError(404, "User not found")

    // Username uniqueness check
    if (username && username.toLowerCase() !== user.username) {
        const existingUsername = await User.findOne({
            username: username.toLowerCase()
        })
        if (existingUsername) {
            throw new ApiError(409, "Username already taken")
        }
        user.username = username.toLowerCase()
    }

    if (fullName) user.fullName = fullName

    if (phone) {
        if (String(phone).length !== 11) {
            throw new ApiError(400, "Phone number 11 digits ka hona chahiye")
        }
        user.phone = phone
    }

    await user.save()

    const updatedUser = await User.findById(user._id)
        .select("-password -refreshToken")

    return res
        .status(200)
        .json(new ApiResponse(200, updatedUser, "Profile updated successfully"))
})

// ─── Addresses ────────────────────────────────────────────────────────────────

// GET /api/v1/users/addresses
const getAddresses = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
        .select("addresses")

    return res
        .status(200)
        .json(new ApiResponse(200, user.addresses, "Addresses fetched successfully"))
})

// POST /api/v1/users/addresses
const addAddress = asyncHandler(async (req, res) => {
    const {
        fullName, phone, street,
        city, province, postalCode,
        country, isDefault
    } = req.body

    if (!fullName || !phone || !street || !city || !province) {
        throw new ApiError(400, "fullName, phone, street, city aur province required hain")
    }

    const user = await User.findById(req.user._id)
    if (!user) throw new ApiError(404, "User not found")

    if (user.addresses.length >= 5) {
        throw new ApiError(400, "Maximum 5 addresses allowed hain")
    }

    // Agar isDefault true hai toh baaki sab false karo
    if (isDefault) {
        user.addresses.forEach(addr => (addr.isDefault = false))
    }

    // Pehla address automatically default
    const shouldBeDefault = user.addresses.length === 0 ? true : !!isDefault

    user.addresses.push({
        fullName,
        phone,
        street,
        city,
        province,
        postalCode: postalCode || "",
        country:    country    || "Pakistan",
        isDefault:  shouldBeDefault
    })

    await user.save()

    return res
        .status(201)
        .json(new ApiResponse(201, user.addresses, "Address added successfully"))
})

// PATCH /api/v1/users/addresses/:addressId
const updateAddress = asyncHandler(async (req, res) => {
    const {
        fullName, phone, street,
        city, province, postalCode,
        country, isDefault
    } = req.body

    const user = await User.findById(req.user._id)
    if (!user) throw new ApiError(404, "User not found")

    const address = user.addresses.id(req.params.addressId)
    if (!address) throw new ApiError(404, "Address not found")

    // Agar isDefault true hai toh baaki sab false karo
    if (isDefault) {
        user.addresses.forEach(addr => (addr.isDefault = false))
    }

    if (fullName   !== undefined) address.fullName   = fullName
    if (phone      !== undefined) address.phone      = phone
    if (street     !== undefined) address.street     = street
    if (city       !== undefined) address.city       = city
    if (province   !== undefined) address.province   = province
    if (postalCode !== undefined) address.postalCode = postalCode
    if (country    !== undefined) address.country    = country
    if (isDefault  !== undefined) address.isDefault  = isDefault

    await user.save()

    return res
        .status(200)
        .json(new ApiResponse(200, user.addresses, "Address updated successfully"))
})

// DELETE /api/v1/users/addresses/:addressId
const deleteAddress = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    if (!user) throw new ApiError(404, "User not found")

    const address = user.addresses.id(req.params.addressId)
    if (!address) throw new ApiError(404, "Address not found")

    const wasDefault = address.isDefault
    address.deleteOne()

    // Agar default delete hua toh pehle wale ko default banao
    if (wasDefault && user.addresses.length > 0) {
        user.addresses[0].isDefault = true
    }

    await user.save()

    return res
        .status(200)
        .json(new ApiResponse(200, user.addresses, "Address deleted successfully"))
})

// PATCH /api/v1/users/addresses/:addressId/set-default
const setDefaultAddress = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    if (!user) throw new ApiError(404, "User not found")

    const address = user.addresses.id(req.params.addressId)
    if (!address) throw new ApiError(404, "Address not found")

    user.addresses.forEach(addr => (addr.isDefault = false))
    address.isDefault = true

    await user.save()

    return res
        .status(200)
        .json(new ApiResponse(200, user.addresses, "Default address updated successfully"))
})

// ─── Exports ──────────────────────────────────────────────────────────────────

export {
    // Auth
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeUserPassword,
    getCurrentUser,
    forgotPassword,
    resetPassword,
    // Profile
    updateProfile,
    // Addresses
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
}