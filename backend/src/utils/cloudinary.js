import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

// ✅ Config zaroor call karo!
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null

        // ✅ File exist karta hai check karo
        if (!fs.existsSync(localFilePath)) {
            return null
        }

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: "sulemanbookstore"
        })

        fs.unlinkSync(localFilePath)
        return response

    } catch (error) {
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath)
        }
        console.log("Cloudinary upload error:", error)
        return null
    }
}

const deleteFromCloudinary = async (publicId) => {
    try {
        if (!publicId) return null
        const response = await cloudinary.uploader.destroy(publicId)
        return response
    } catch (error) {
        console.log("Cloudinary delete error:", error)
        return null
    }
}

export { uploadOnCloudinary, deleteFromCloudinary }