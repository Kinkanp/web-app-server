import { inject, injectable } from 'inversify';
import { HttpInterceptor, HttpInterceptorParams, RouteHandlerResponse } from '@packages/http-server';
import { CACHE_SERVICE, ICacheService } from '../../../common/caching';
import { HttpInterceptorHandle } from '@packages/http-server/dist/src/server/interceptor-handle';
import { APP_CONFIG, AppConfig } from '../../../common/config';
import { IAppLogger, LOGGER } from '../../../common/logger';

@injectable()
export class HttpCacheInterceptor implements HttpInterceptor {
  constructor(
    @inject(CACHE_SERVICE) private cacheService: ICacheService,
    @inject(APP_CONFIG) private config: AppConfig,
    @inject(LOGGER) private logger: IAppLogger,
  ) {
  }

  async intercept({ req, routeOptions }: HttpInterceptorParams, handle: HttpInterceptorHandle): Promise<RouteHandlerResponse> {
    if (!routeOptions?.cacheKey) {
      return handle.run();
    }

    const key = routeOptions.cacheKey;

    if (req.method !== 'GET') {
      return handle.run()
        .finally(() => {
          this.logger.info('Cache purged:', key)
          this.cacheService.delete(key);
        });
    }

    const cache = await this.cacheService.get(key);

    if (cache) {
      this.logger.info('Cache found:', key)
      return cache;
    }

    return handle.run().then(result => {
      this.cacheService.set(key, result, { ttlInSeconds: this.config.memoryStorage.ttlInSeconds })
        .then(() => this.logger.info('Set cache:', key))
        .catch(() => this.logger.error('Unable to set cache:', key))

      return result;
    });
  }
}
