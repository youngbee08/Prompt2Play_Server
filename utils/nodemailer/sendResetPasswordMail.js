const transporter = require("./transporter");

const sendForgotPasswordMail = (userName, email, token) => {
    const appName = process.env.appName;
    const supportEmail = process.env.supportEmail;
    const clientDomain = process.env.clientDomain;
    const logoUrl = process.env.logoUrl;

    const emailTemplate = {
        to: `${email}`,
        from: `${appName} <${supportEmail}>`,
        replyTo: `${supportEmail}`,
        subject: `Reset Your Password - ${appName}`,
        html: `
            <div style="max-width:600px; margin:30px auto; padding:20px; background:#ffffff; border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,0.08); font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                <!-- Header -->
                <div style="text-align:center; padding:20px 0; border-bottom:1px solid #eaeaea;">
                    <img src="${logoUrl}" alt="${appName} Logo" style="max-width:180px; height:auto;">
                    <h1 style="color:#2c3e50; font-size:24px; margin-top:20px; font-weight:600;">Reset Your Password</h1>
                </div>

                <!-- Body Content -->
                <div style="padding:30px 20px; text-align:center;">
                    <h1>Hi, ${userName}👋</h1>
                    <p style="font-size:16px; color:#555; margin-bottom:20px;">
                        We received a request to reset your password for your <strong>${appName}</strong> account.
                    </p>
                    <p style="font-size:16px; color:#555; margin-bottom:20px;">
                        Click the button below to set a new password. If you didn’t request a password reset, you can safely ignore this email.
                    </p>

                    <!-- Reset Password Button -->
                    <a href="${clientDomain}/mail/updatePassword/${token}" style="display:inline-block; padding:14px 28px; background:linear-gradient(135deg, #1e3c72, #2a5298); color:#ffffff !important; text-decoration:none; border-radius:50px; font-weight:600; font-size:16px; margin:25px 0; transition:all 0.3s ease; box-shadow:0 4px 15px rgba(30,60,114,0.3);">
                        Reset Password
                    </a>

                    <p style="font-size:16px; color:#555;">
                        Note: This link will expire in <strong style="color:#2c3e50;">5 minutes</strong> for security reasons.
                    </p>
                </div>

                <!-- Footer -->
                <div style="text-align:center; padding:20px; font-size:14px; color:#999; border-top:1px solid #eaeaea;">
                    <p style="margin-bottom:10px;">
                        Need help? <a href="mailto:${supportEmail}" style="color:#1e3c72; text-decoration:none;">Contact Support</a>
                    </p>
                    <p style="margin:0;">© 2025 ${appName}. All rights reserved.</p>
                </div>
            </div>
        `
    };

    transporter.sendMail(emailTemplate, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Password Reset Mail Sent Successfully");
        }
    });
};

module.exports = sendForgotPasswordMail;