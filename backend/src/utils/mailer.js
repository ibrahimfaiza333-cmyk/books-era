import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendWelcomeEmail = async (userEmail) => {
    try {
        const mailOptions = {
            from: `"Suleman Books" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: "Welcome to Suleman Books Book Club! 📚",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
                    <div style="background-color: #111827; padding: 24px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Welcome to the Club!</h1>
                    </div>
                    <div style="padding: 32px; background-color: #ffffff;">
                        <h2 style="color: #1f2937; margin-top: 0;">Hi there! 👋</h2>
                        <p style="color: #4b5563; line-height: 1.6; font-size: 16px;">
                            Thank you for subscribing to our newsletter! We're thrilled to have you in the Suleman Books family.
                        </p>
                        <p style="color: #4b5563; line-height: 1.6; font-size: 16px;">
                            Get ready for:
                        </p>
                        <ul style="color: #4b5563; line-height: 1.6; font-size: 16px; padding-left: 20px;">
                            <li>Exclusive discounts and early access to sales 🎁</li>
                            <li>Weekly book recommendations just for you 📖</li>
                            <li>Updates on new arrivals and bestsellers 🚀</li>
                        </ul>
                        <div style="text-align: center; margin-top: 32px;">
                            <a href="http://localhost:3000" style="display: inline-block; background-color: #f97316; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                                Explore Books Now
                            </a>
                        </div>
                    </div>
                    <div style="background-color: #f3f4f6; padding: 16px; text-align: center;">
                        <p style="color: #9ca3af; margin: 0; font-size: 14px;">
                            © ${new Date().getFullYear()} Suleman Books. All rights reserved.
                        </p>
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        return info;
    } catch (error) {
        console.error("Error sending email: ", error);
        throw error;
    }
};
