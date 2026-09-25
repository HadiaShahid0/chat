import nodemailer from "nodemailer"

const transporter= nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 456,
    secure: true,
    auth:{
        user: process.env.EMAIL,
        pass: process.env.PASS,
    },
});

export default transporter;