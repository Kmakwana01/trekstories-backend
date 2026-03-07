"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    port: parseInt(process.env.PORT || '3000', 10),
    database: {
        uri: process.env.MONGO_URI || 'mongodb://localhost:27017/travel',
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'your_secret',
        expiresIn: process.env.JWT_EXPIRES_IN || '15m',
        refreshSecret: process.env.JWT_REFRESH_SECRET || 'your_refresh_secret',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    },
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
    },
    mail: {
        host: process.env.MAIL_HOST || 'smtp.sendgrid.net',
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
        port: parseInt(process.env.MAIL_PORT || '587', 10),
        secure: process.env.MAIL_SECURE === 'true',
    },
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackUrl: process.env.GOOGLE_CALLBACK_URL,
    },
    upload: {
        dest: process.env.UPLOAD_DEST || './uploads',
    },
    imgbb: {
        apiKey: process.env.IMGBB_API_KEY,
    },
});
//# sourceMappingURL=configuration.js.map