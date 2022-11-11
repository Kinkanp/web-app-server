import { HttpResponse } from './server.model';

export class HttpResponseUtil {
  constructor(private res: HttpResponse) {}

  public send(data: unknown): this {
    this.res.writeHead(200, { 'Content-type': 'application/json' });
    this.res.end(JSON.stringify(data))

    return this;
  }

  public ok(res: HttpResponse): this {
    res.statusCode = 200;

    return this;
  }
}