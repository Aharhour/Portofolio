import nodemailer from 'nodemailer';

// Brevo SMTP transporter for sending transactional emails
const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const sendEmail = async ({ to, subject, body }) => {
    if (!to || !subject || !body) {
        throw new Error('Email requires to, subject, and body fields.');
    }

    const response = await transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to,
        subject,
        html: body,
    })
    return response;
}

export default sendEmail;
