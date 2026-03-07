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
    imgbb: {
        apiKey: string | undefined;
    };
};
export default _default;
