import 'reflect-metadata';
import { beforeEach, describe, expect, Mock, test, vitest } from 'vitest';
import { createTestingModule } from '@packages/ioc';
import { CACHE_SERVICE, ICacheService } from '../../../common/caching';
import { LOGGER } from '../../../common/logger';
import { Logger, LoggerOptions } from '@packages/logger';
import { HttpCacheInterceptor } from './http-cache.interceptor';
import { APP_CONFIG } from '../../../common/config';
import { HttpInterceptorParams } from '@packages/http-server';
import { HttpInterceptorHandle } from '@packages/http-server/dist/src/server/interceptor-handle';

const appConfig = { memoryStorage: { ttlInSeconds: 1 } };

const createInterceptor = async (cacheService: ICacheService) => {
  const module = await createTestingModule(() => ({
    exports: [HttpCacheInterceptor],
    declare: [
      { map: CACHE_SERVICE, to: cacheService },
      { map: APP_CONFIG, to: appConfig },
      { map: LOGGER, to: new Logger({} as LoggerOptions) },
      HttpCacheInterceptor
    ]
  }));

  return module.import(HttpCacheInterceptor as unknown as symbol) as HttpCacheInterceptor;
};

describe('HttpCacheInterceptor', () => {
  const handleData = [1, 2, 3, 4, 5];

  let handleRun: Mock;
  let handle: HttpInterceptorHandle;
  let cacheService: { get: Mock, set: Mock, delete: Mock };

  beforeEach(() => {
    cacheService = {
      set: vitest.fn(),
      get: vitest.fn(),
      delete: vitest.fn(),
    };
    handleRun = vitest.fn().mockReturnValue(Promise.resolve(handleData));
    handle = new HttpInterceptorHandle(handleRun);
    cacheService.set.mockReturnValue(Promise.resolve())
  })

  test('should return handle if no cache key provided', async () => {
    const interceptor = await createInterceptor(cacheService);
    const params = {
      req: { method: 'GET' },
      routeOptions: { cacheKey: null }
    } as HttpInterceptorParams;

    const result = await interceptor.intercept(params, handle);

    expect(handleRun).toHaveBeenCalled();
    expect(cacheService.get).not.toHaveBeenCalled();
    expect(cacheService.set).not.toHaveBeenCalled();
    expect(cacheService.delete).not.toHaveBeenCalled();
    expect(result).toEqual(handleData)
  });

  test('should invalidate cache and return data for NOT GET requests', async () => {
    const interceptor = await createInterceptor(cacheService);
    const params = {
      req: { method: 'POST' },
      routeOptions: { cacheKey: 'CACHE_KEY' }
    } as HttpInterceptorParams;

    const result = await interceptor.intercept(params, handle);

    expect(handleRun).toHaveBeenCalled();
    expect(cacheService.get).not.toHaveBeenCalled();
    expect(cacheService.set).not.toHaveBeenCalled();
    expect(cacheService.delete).toHaveBeenCalledWith(params.routeOptions.cacheKey);
    expect(result).toEqual(handleData)
  });

  test.only('should return cached data', async () => {
    const data = [1, 2, 3];
    cacheService.get.mockReturnValue(data);
    const interceptor = await createInterceptor(cacheService);
    const params = {
      req: { method: 'GET' },
      routeOptions: { cacheKey: 'CACHE_KEY' }
    } as HttpInterceptorParams;

    const result = await interceptor.intercept(params, handle);

    expect(handleRun).not.toHaveBeenCalled();
    expect(cacheService.get).toHaveBeenCalledWith(params.routeOptions.cacheKey);
    expect(cacheService.set).not.toHaveBeenCalled();
    expect(cacheService.delete).not.toHaveBeenCalled();
    expect(result).toEqual(data);
  });

  test('should set cache and return data', async () => {
    const interceptor = await createInterceptor(cacheService);
    const params = {
      req: { method: 'GET' },
      routeOptions: { cacheKey: 'CACHE_KEY' }
    } as HttpInterceptorParams;

    const result = await interceptor.intercept(params, handle);

    expect(handleRun).toHaveBeenCalled();
    expect(cacheService.get).toHaveBeenCalledWith(params.routeOptions.cacheKey);
    expect(cacheService.set).toHaveBeenCalledWith(
      params.routeOptions.cacheKey,
      handleData,
      { ttlInSeconds: appConfig.memoryStorage.ttlInSeconds }
    );
    expect(cacheService.delete).not.toHaveBeenCalled();
    expect(result).toEqual(handleData);
  });
})
