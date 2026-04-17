import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD
    }
})

export const sendVerificationEmail = async(email, rawToken)=>{
    const verificationUrl = `https://localhost:8080/verify?token=${rawToken}&email=${email}`
    const mailOptions = {
        from: process.env.USER_EMAIL,
        to: email,
        subject: "Verify your account",
        text: `Pleae click on the following link to verify your account: ${verificationUrl}`,
        html: `<p>Please click <a href="${verificationUrl}">here</a> to verify your account.</p>`
    }
    try {
        await transporter.sendMail(mailOptions);
        console.log("Verification email sent to", email);
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send verification email");
    }
}

export const sendResetMail = async(email, rawResetToken) => {
    const resetPasswordLink = `https://localhost:8080/reset-password?token=${rawResetToken}`
    const mailOptions = {
        from : process.env.USER_EMAIL,
        to: email,
        subject: "Reset Password Link",
        text: `Pleae click on the following link to reset your password: ${resetPasswordLink}`,
        html: `<p>Please click <a href="${resetPasswordLink}">here</a> to verify your account.</p>`
    }
    try {
        await transporter.sendMail(mailOptions);
        console.log("Reset Password Link sent to", email);
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send Reset Password Link email");
    }
}