import { describe, expect, test } from 'vitest';
import { HttpRouting } from './routing';
import { HttpRequest } from '../server';
import { Guard, GuardParams, Route, Routes } from './routing.model';

const DYNAMIC_PARAMS = ['value_1', 'value_2'];

const createAndMatchDynamicRoutes = (
  routeToMatch: Route,
  routes: Routes,
  baseUrl = ''
) => {
  const routing = new HttpRouting([...routes, routeToMatch], baseUrl);
  const url = DYNAMIC_PARAMS.reduce((url, param, i) => url.replace(`:${param}`, `${i}`), routeToMatch.path);
  const req = { url, method: routeToMatch.method } as HttpRequest;

  const { handler } = routing.match(req);

  expect(handler).toEqual(routeToMatch.handler);
};

const createAndMatchRoutes = (
  routeToMatch: Route,
  routes: Routes,
  baseUrl = ''
) => {
  const routing = new HttpRouting([...routes, routeToMatch], baseUrl);
  const url = `${baseUrl}${routeToMatch.path}`;
  const req = { url, method: routeToMatch.method } as HttpRequest;

  const { handler } = routing.match(req);

  expect(handler).toEqual(routeToMatch.handler);
};

describe('routing', () => {
  test('should create routes' , () => {
    const routing = new HttpRouting([], '');

    expect(routing).toBeTruthy();
  })

  test('should match route `/`', () => {
    createAndMatchRoutes(
      { path: '', method: 'GET', handler: async () => '' },
      [
        { path: 'b', method: 'GET', handler: async () => '' },
        { path: 'c', method: 'GET', handler: async () => '' },
      ],
    );
  });

  test('should match route `/path`', () => {
    createAndMatchRoutes(
      { path: 'b', method: 'GET', handler: async () => '' },
      [
        { path: 'c', method: 'GET', handler: async () => '' },
        { path: 'e', method: 'GET', handler: async () => '' },
      ]
    );
  });

  test('should match route `/path/to/route`', () => {
    createAndMatchRoutes(
      { path: 'a/b/c/d', method: 'GET', handler: async () => '' },
      [
        { path: 'a/b/c/d/e', method: 'GET', handler: async () => '' },
        { path: 'a/b/c/e', method: 'GET', handler: async () => '' },
      ]
    );
  });

  test('should match route with dynamic params', () => {
    createAndMatchDynamicRoutes(
      { path: 'a/:value_1', method: 'GET', handler: async () => '1' },
      [
        { path: 'b/:value_1', method: 'GET', handler: async () => '2' },
        { path: 'a/b/:value_1', method: 'GET', handler: async () => '3' },
      ]
    );
  });

  test('should match route with multiple dynamic params', () => {
    createAndMatchDynamicRoutes(
      { path: 'a/:value_1/:value_2', method: 'GET', handler: async () => '' },
      [
        { path: 'b/:value_1/value_2', method: 'GET', handler: async () => '' },
        { path: 'a/b/:value_1', method: 'GET', handler: async () => '' },
      ]
    );
  });

  test('should handle not existing route', () => {
    const routing = new HttpRouting(
      [
        { path: 'a/b/c', method: 'GET', handler: async () => '' },
        { path: 'a/b/c/d/', method: 'GET', handler: async () => '' },
      ],
      ''
    );
    const req = { url: 'a/b/c/d/e', method: 'GET' } as HttpRequest;

    const { handler } = routing.match(req);

    expect(handler).toBeFalsy();
  });

  test('should handle query params', () => {
    const routes = [
      { path: 'a/b', method: 'GET', handler: async () => '' },
      { path: 'a', method: 'GET', handler: async () => '' },
    ] as Routes;
    const routing = new HttpRouting(routes, '');
    const req = { url: `${routes[0].path}?q=1&w=2`, method: 'GET' } as HttpRequest;

    const { handler } = routing.match(req);

    expect(handler).toEqual(routes[0].handler);
  });

  test('should handle base url', () => {
    createAndMatchRoutes(
      { path: '', method: 'GET', handler: async () => '' },
      [
        { path: 'b', method: 'GET', handler: async () => '' },
        { path: 'c', method: 'GET', handler: async () => '' },
      ],
      'base-url'
    );
  });

  test.todo('should handle wildcard route');

  describe('composite routes', () => {
    const createGuard = (): Guard => ({
      allow: (params: GuardParams) => Promise.resolve(true)
    })

    const routesMap: Record<string, Route> = {
      parent1: { path: 'parent1', method: 'GET', handler: async () => '', guards: [createGuard()] },
      parent2: { path: 'parent2', method: 'GET', handler: async () => '', guards: [createGuard()]},
      child1: { path: 'child_2', method: 'GET', handler: async () => '', guards: [createGuard()] },
      child2: { path: 'child', method: 'GET', handler: async () => '', guards: [createGuard()]}
    };

    const createRoutes = (routeToMatch: Route) => ([
      {
        ...routesMap.parent1,
        children: [
          {
            ...routesMap.parent2,
            children: [
              routesMap.child1,
              routeToMatch
            ]
          }
        ]
      }
    ]);

    test('should handle composite routes', () => {
      const routeToMatch: Route = { path: 'child', method: 'GET', handler: async () => '', };
      const baseUrl = 'base-url';
      const url = `${baseUrl}/parent1/parent2/child`;
      const req = { url, method: 'GET' } as HttpRequest;
      const routing = new HttpRouting(createRoutes(routeToMatch), baseUrl);
      const { handler } = routing.match(req);

      expect(handler).toEqual(routeToMatch.handler);
    });

    test('should handle composite routes guards', () => {
      const routeToMatch: Route = routesMap.child2;
      const baseUrl = '';
      const url = `${baseUrl}/parent1/parent2/child`;
      const req = { url, method: 'GET' } as HttpRequest;
      const routing = new HttpRouting(createRoutes(routeToMatch), baseUrl);
      const { handler, guards } = routing.match(req);

      expect(guards).toEqual([
        routesMap.parent1.guards![0],
        routesMap.parent2.guards![0],
        routesMap.child2.guards![0],
      ]);
      expect(handler).toEqual(routeToMatch.handler);
    });

    test('should handle composite routes guards 2', () => {
      const routeToMatch: Route = routesMap.parent2;
      const baseUrl = '';
      const url = `${baseUrl}/parent1/parent2`;
      const req = { url, method: 'GET' } as HttpRequest;
      const routing = new HttpRouting(createRoutes(routeToMatch), baseUrl);
      const { handler, guards } = routing.match(req);

      expect(guards).toEqual([
        routesMap.parent1.guards![0],
        routesMap.parent2.guards![0],
      ]);
      expect(handler).toEqual(routeToMatch.handler);
    });
  });
})
