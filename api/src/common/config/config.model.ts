export interface AppConfig {
    environment: {
        isDev: boolean;
    }
    database: {
        url: string;
        name: string;
        user: string;
        password: string;
        port: number;
    },
    memoryStorage: {
        url: string
    },
    app: {
        port: number;
        baseUrl: string;
        jwtSecret: string;
        jwtExpiresIn: string;
        logsPath: string;
    }
}
