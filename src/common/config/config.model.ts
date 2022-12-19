export interface AppConfig {
    environment: {
        isDev: boolean;
    }
    database: {
        url: string;
    },
    app: {
        port: number;
        baseUrl: string;
        jwtSecret: string;
        jwtExpiresIn: string;
    }
}
