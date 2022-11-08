export interface Config {
    database: {
        host: string;
        user: string;
        name: string;
        password: string;
        port: number;
    },
    app: {
        port: number;
    }
}

export interface AppConfigModel {
    get(): Config;
}