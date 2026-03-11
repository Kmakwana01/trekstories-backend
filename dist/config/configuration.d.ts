declare const _default: () => {
    port: number;
    database: {
        uri: string;
    };
    jwt: {
        secret: string;
        expiresIn: string;
        refreshSecret: string;
        refreshExpiresIn: string;
    };
    redis: {
        host: string;
        port: number;
    };
    mail: {
        host: string;
        user: string | undefined;
        pass: string | undefined;
        port: number;
        secure: boolean;
    };
    google: {
        clientId: string | undefined;
        clientSecret: string | undefined;
        callbackUrl: string | undefined;
    };
    upload: {
        dest: string;
    };
    image: {
        provider: string;
        cloudinary: {
            cloudName: string | undefined;
            apiKey: string | undefined;
            apiSecret: string | undefined;
        };
        imgbb: {
            apiKey: string | undefined;
        };
        imagekit: {
            publicKey: string | undefined;
            privateKey: string | undefined;
            urlEndpoint: string | undefined;
        };
    };
};
export default _default;
