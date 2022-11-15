import { HttpRequest } from './server.model';

export class HttpRequestUtil {
  constructor(private req: HttpRequest) {
  }

  public getData<T = unknown>(): Promise<T> {
    let rawData = '';

    return new Promise((resolve, reject) => {
      this.req.on('data', chunk => rawData += chunk);
      this.req.on('error', (error) => reject(error));
      this.req.on('end', () => {
        try {
          resolve(JSON.parse(rawData));
        } catch(error) {
          reject(error);
        }
      });
    });
  }

  public getQueryParams(params: string | string[]): string | string[] {
    const searchParams = new URL(this.req.url, `https://${this.req.headers.host}`).searchParams;

    if (typeof params === 'string') {
      return searchParams.get(params);
    }

    return params.map(param => searchParams.get(param));
  }
}
