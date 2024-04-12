export interface AppConfig {
    environment: {
        isDev: boolean;
    }
    database: {
        url: string;
    },
    memoryStorage: {
        url: string,
        ttlInSeconds: number
    },
    app: {
        port: number;
        baseUrl: string;
        jwtSecret: string;
        jwtExpiresIn: string;
        logsPath: string;
    }
}
