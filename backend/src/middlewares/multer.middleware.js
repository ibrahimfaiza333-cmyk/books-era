import multer from "multer"
import path from "path"
import ApiError from "../utils/ApiError.js"

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve("public/temp"))
    },

    filename: function (req, file, cb) {
        const uniqueName = Date.now() + "-" + file.originalname
        cb(null, uniqueName)
    }
})

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp"
    ]

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(
            new ApiError(
                400,
                "Only jpg, jpeg, png, webp images are allowed"
            ),
            false
        )
    }
}

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
})