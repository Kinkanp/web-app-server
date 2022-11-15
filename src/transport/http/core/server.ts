import * as http from 'http';
import { HttpServerConfig, HttpRequest, HttpResponse } from './server.model';
import { Routes } from './routing/routing.model';
import { HttpRouting } from './routing/routing';

export class HttpServer {
  private server: http.Server;
  private routing: HttpRouting;

  constructor(private config: HttpServerConfig) {}

  public create(): HttpServer {
    this.server = http.createServer((req, res) => this.handleRequest(req, res));
    return this;
  }

  public listen(): Promise<void> {
    return new Promise((resolve) => {
      this.server.listen(this.config.port, () => {
        console.log(`Server is running on: http://localhost:${this.config.port}`);
        resolve();
      });
    });
  }

  public setRoutes(routes: Routes): this {
    this.routing = new HttpRouting(routes, this.config.baseUrl);
    return this;
  }

  private handleRequest(req: HttpRequest, res: HttpResponse): void {
    const { handler, dynamicParams } = this.routing.match(req);

    if (handler) {
      // TODO
      handler(req, res, dynamicParams);
    } else {
      // TODO
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Not found' }));
    }
  }
}
