import * as http from 'http';
import { AppServerConfig, HttpRequest, HttpResponse } from './server.model';
import { RouteHandler, Routes } from './routing/routing.model';
import { ROUTING_ID_SIGN } from './routing/routing.constants';

export class AppServer {
  private server: http.Server;
  private routes: Routes;

  constructor(private config: AppServerConfig) {}

  public create(): AppServer {
    this.server = http.createServer((req, res) => this.handleRequest(req, res));

    return this;
  }

  public listen(): void {
    this.server.listen(this.config.port, () => {
      console.log(`Server is running on: http://localhost:${this.config.port}`);
    });
  }

  public setRoutes(routes: Routes): void {
    this.routes = routes;
  }

  private handleRequest(req: HttpRequest, res: HttpResponse): void {
    const { handler } = this.matchRoute(req);

    if (handler) {
      handler(req, res);
    } else {
      // TODO
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Not found' }));
    }
  }

  private matchRoute(req: HttpRequest): { handler?: RouteHandler; dynamicParams: string[] } {
    const reqUrlParts = req.url?.split('/');
    const dynamicParams: string[] = [];

    const route = this.routes
      .filter(({ method }) => req.method === method)
      .find(({ path, method }) => {
        const pathParts = path.split('/');

        if (pathParts.length !== reqUrlParts?.length) {
          return false;
        }

        return pathParts.every((part, i) => {
          if (part === reqUrlParts[i]) {
            return true;
          }

          if (part.includes(ROUTING_ID_SIGN)) {
            dynamicParams.push(reqUrlParts[i]);
            return true;
          }

          return false;
        });
      });

    return { handler: route?.handler, dynamicParams };
  }
}
