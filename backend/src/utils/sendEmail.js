const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const mg = mailgun.client({ username: "api", key: process.env.MAILGUN_API_KEY || "asd" });

const verificationEmail = async (email, verificationString) => {
    try {
        return await mg.messages.create('sandbox89bb0b3d834f40b4acfe1588bd5066eb.mailgun.org', {
            from: "<mailgun@sandbox89bb0b3d834f40b4acfe1588bd5066eb.mailgun.org>",
            to: [email],
            subject: "Verification email",
            text: `Thanks for signing up! To verify your email, click here:
            http://localhost:3000/verify-email/${verificationString}`
        });
    } catch (error) {
        throw error;
    }
}

const passwordResetEmail = async (email, verificationString) => {
    try {
        return await mg.messages.create('sandbox89bb0b3d834f40b4acfe1588bd5066eb.mailgun.org', {
            from: "<mailgun@sandbox89bb0b3d834f40b4acfe1588bd5066eb.mailgun.org>",
            to: [email],
            subject: "Password reset",
            text: `To reset your password, click here:
            http://localhost:3000/newpassword/${verificationString}`
        });
    } catch (error) {
        throw error;
    }
}

module.exports = { verificationEmail, passwordResetEmail };