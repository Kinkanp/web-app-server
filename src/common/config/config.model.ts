export interface AppConfig {
    database: {
        host: string;
        user: string;
        name: string;
        password: string;
        port: number;
    },
    app: {
        port: number;
        baseUrl: string;
    }
}
