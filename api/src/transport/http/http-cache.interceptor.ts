import { inject, injectable } from 'inversify';
import { HttpInterceptor, RouteHandlerResponse } from '@packages/http-server';
import { CACHE_SERVICE, ICacheService } from '../../common/caching';
import { AppHttpInterceptorParams } from './http.constants';

@injectable()
export class HttpCacheInterceptor implements HttpInterceptor {
  constructor(
    @inject(CACHE_SERVICE) private cacheService: ICacheService
  ) {
  }

  public async intercept({ req, context } : AppHttpInterceptorParams): Promise<RouteHandlerResponse> {
    const user = context.get('user');
    const cacheKey = [
      req.url,
      user?.id ? `uid: ${user.id}` : ''
    ].filter(Boolean).join(':');

    const cache = await this.cacheService.get(cacheKey);

    if (cache) {
      console.log('cache found');
      return cache;
    }

    console.log('no cache');
    console.log('intercepting...', req.url);
    req.once('end', () => console.log('intercepting end'));
    req.once('error', () => {
      // TODO: remove listener only needed listeners
      req.removeAllListeners();
    });

    // return this.cacheService.(params);
    return Promise.resolve(1);
  }
}
