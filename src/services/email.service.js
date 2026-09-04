import nodemailer from "nodemailer";
import {ENV} from "../lib/env.js";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: ENV.GOOGLE_USER,
        clientId: ENV.GOOGLE_CLIENT_ID,
        clientSecret: ENV.GOOGLE_CLIENT_SECRET,
        refreshToken: ENV.GOOGLE_REFRESH_TOKEN
    }
});


