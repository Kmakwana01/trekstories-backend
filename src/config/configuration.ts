export default () => ({
    port: parseInt(process.env.PORT || '3000', 10),
    database: {
        uri: process.env.MONGO_URI || 'mongodb://localhost:27017/travel',
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'your_secret',
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
    },
    mail: {
        host: process.env.MAIL_HOST,
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
    upload: {
        dest: process.env.UPLOAD_DEST || './uploads',
    },
});
