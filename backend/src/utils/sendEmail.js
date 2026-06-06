import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

export const sendEmail = async (to, subject, html) => {
    try {
        await transporter.sendMail({
            from:    `"Suleman Book Store" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        })
        console.log("Email sent to:", to)
    } catch (error) {
        console.log("Email error:", error)
        throw error
    }
}

export const forgotPasswordEmail = (resetUrl) => {
    return `
    <div style="font-family: Arial; max-width: 600px; 
                margin: 0 auto; padding: 20px;
                border: 1px solid #eee; border-radius: 8px;">

        <h2 style="color: #333; text-align: center;">
            🔐 Password Reset Request
        </h2>

        <p>Hello,</p>

        <p>
            We received a request to reset your password 
            for your <strong>Suleman Book Store</strong> account.
        </p>

        <p>Click the button below to reset your password:</p>

        <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="display: inline-block;
                      background: #4F46E5; 
                      color: white;
                      padding: 14px 32px; 
                      text-decoration: none;
                      border-radius: 6px;
                      font-size: 16px;
                      font-weight: bold;">
                Reset Password
            </a>
        </div>

        <p style="color: #e53e3e; font-weight: bold;">
            ⚠️ This link will expire in 15 minutes!
        </p>

        <p style="color: #666;">
            If you did not request a password reset, 
            please ignore this email. 
            Your password will remain unchanged.
        </p>

        <hr style="border: 1px solid #eee; margin: 20px 0;">

        <p style="color: #666; font-size: 13px;">
            For security, never share this link with anyone.
        </p>

        <p style="color: #999; font-size: 12px; text-align: center;">
            © 2024 Suleman Book Store. All rights reserved.
        </p>
    </div>
    `
}