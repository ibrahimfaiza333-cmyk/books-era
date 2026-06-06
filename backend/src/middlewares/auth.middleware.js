import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"

export const verifyJWT = async (req, res, next) => {
    try {
        // 1. Token lo
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Token not found"
            })
        }

        // 2. Token verify karo
        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        )

        // 3. User dhundo
        const user = await User.findById(decoded?._id)
            .select("-password -refreshToken")

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User not found"
            })
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "your account is banned"
            })
        }

        // 5. User attach karo
        req.user = user
        next()

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized: Invalid token"
        })
    }
}