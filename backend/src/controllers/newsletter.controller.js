import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sendWelcomeEmail } from "../utils/mailer.js";

// POST /api/v1/newsletter/subscribe
const subscribeToNewsletter = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    // In the future, we could save this email to a Newsletter model.
    // For now, we simply send a welcome email to the user.
    await sendWelcomeEmail(email);

    return res.status(200).json(
        new ApiResponse(200, {}, "Successfully subscribed to the newsletter")
    );
});

export { subscribeToNewsletter };
