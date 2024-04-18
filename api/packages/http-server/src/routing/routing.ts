import { Guard, MatchRouteResult, Routes, GuardParams, Route } from './routing.model';
import { HttpRequest } from '../server';
import { ROUTING_ID_SIGN, WILDCARD_ROUTE_SIGN } from './routing.constants';

export class HttpRouting {
  constructor(private readonly routes: Routes, private baseUrl: string) {
    this.routes = this.flattenChildRoutes(routes);
    this.routes = this.setBaseUrl(this.routes);
  }

  public match(req: HttpRequest): MatchRouteResult {
    const [urlWithoutQuery] = req.url?.split('?') || [''];
    const reqUrlParts = urlWithoutQuery.length ?
      urlWithoutQuery.split('/').filter(Boolean) :
      [''];
    const dynamicParams: string[] = [];

    let route = this.routes
    .filter(({ method }) => req.method === method)
    .find(({ path }) => {
      const pathParts = path.split('/');

      if (pathParts.length !== reqUrlParts?.length) {
        return false;
      }

      return pathParts.every((part, i) => {
        [part] = part.split('?');

        if (reqUrlParts[i].includes(ROUTING_ID_SIGN)) {
          return false;
        }

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

    if (!route) {
      route = this.routes.find(({ path }) => path === WILDCARD_ROUTE_SIGN);
    }

    return {
      handler: route?.handler,
      guards: route?.guards,
      options: route?.options,
      dynamicParams
    };
  }

  public runGuards(guards: Guard[] = [], params: GuardParams): Promise<void> {
    const promises = guards.map(guard => guard.allow(params));

    return Promise.all(promises).then();
  }

  private setBaseUrl(routes: Routes): Routes {
    const createPath = (path: string) => [this.baseUrl, path].filter(Boolean).join('/');

    return [...routes].map(route => ({ ...route, path: createPath(route.path) }));
  }

  private flattenChildRoutes(initialRoutes: Routes = [], parentRoute?: Route): Routes {
    const routes = [...initialRoutes];
    const flattenRoutes: Routes = [];

    for (let i = 0; i < routes.length; i++) {
      const currentRoute = {
        ...this.mergeRoutes(parentRoute, routes[i]),
        path: `${parentRoute?.path || ''}${routes[i].path}`
      };

      flattenRoutes.push({ ...currentRoute, children: [] });

      if (currentRoute.children?.length) {
        currentRoute.children.forEach(children => {
          const mergedRoute = this.mergeRoutes(currentRoute, children);

          children.children = this.flattenChildRoutes(mergedRoute.children, {
            ...mergedRoute,
            path: `${mergedRoute.path}/`
          });

          flattenRoutes.push({ ...mergedRoute, children: [] }, ...children.children)
        });
      }
    }

    return flattenRoutes;
  }

  private mergeRoutes(parent: Route | undefined, child: Route): Route {
    return {
      ...child,
      path: [parent?.path, child.path].filter(Boolean).join('/'),
      guards: [...parent?.guards ?? [], ...child.guards || []],
    }
  }
}
