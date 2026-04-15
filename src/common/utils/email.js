import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
})

export const sendVerificationEmail = async(userEmail, rawToken)=>{
    const verificationUrl = `https://localhost:8080/verify?token=${rawToken}&email=${userEmail}`
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: "Verify your account",
        text: `Pleae click on the following link to verify your account: ${verificationUrl}`,
        html: `<p>Please click <a href="${verificationUrl}">here</a> to verify your account.</p>`
    }
    try {
        await transporter.sendMail(mailOptions);
        console.log("Verification email sent to", userEmail);
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send verification email");
    }
}

