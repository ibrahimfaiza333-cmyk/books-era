// models/review.model.js
import mongoose, { Schema } from "mongoose"
import { Book } from "./books.model.js"

const reviewSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        book: {
            type: Schema.Types.ObjectId,
            ref: "Book",
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            trim: true
        },
        isVerifiedPurchase: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
)

// ek user ek book pe sirf ek review
reviewSchema.index({ user: 1, book: 1 }, { unique: true })

// Book rating auto update hook
reviewSchema.post("save", async function () {
    const result = await mongoose.model("Review").aggregate([
        { $match: { book: this.book } },
        {
            $group: {
                _id:       "$book",
                avgRating: { $avg: "$rating" },
                count:     { $sum: 1 }
            }
        }
    ])

    await Book.findByIdAndUpdate(this.book, {
        ratingsAverage: result[0]?.avgRating || null,
        ratingsCount:   result[0]?.count     || 0
    })
})

// Review delete hone pe bhi rating update ho
reviewSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        const result = await mongoose.model("Review").aggregate([
            { $match: { book: doc.book } },
            {
                $group: {
                    _id:       "$book",
                    avgRating: { $avg: "$rating" },
                    count:     { $sum: 1 }
                }
            }
        ])

        await Book.findByIdAndUpdate(doc.book, {
            ratingsAverage: result[0]?.avgRating || 0,
            ratingsCount:   result[0]?.count     || 0
        })
    }
})

export const Review = mongoose.model("Review", reviewSchema) 