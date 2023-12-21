import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (to: string, html: string) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: config.NODE_ENV === 'production',
        auth: {
            user: "noyonhossain560@gmail.com",
            pass: "vcxj atpn glyb fish",
        }
    });

    await transporter.sendMail({
        from: 'noyonhossain560@gmail.com', // sender address
        to,
        subject: "Reset Your PH-University Password Within Ten Minutes.", // Subject line
        text: "Reset Your Password Within Ten Minutes.", // plain text body
        html
    });
}