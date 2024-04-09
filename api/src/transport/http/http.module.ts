import { AppHttpExceptionHandler } from './http-exception-handler';
import { AppModule } from '@packages/ioc';
import { ConfigModule } from '../../common/config';
import { LoggerModule } from '../../common/logger';
import { AppHttpServer } from './app-http-server';
import { CacheModule } from '../../common/caching';
import { HttpCacheInterceptor } from './http-cache-interceptor';

export const HTTP_SERVER = Symbol('App http server');
export const HTTP_EXCEPTION_HANDLER = Symbol('Http exception handler');

export class HttpModule extends AppModule<{ [HTTP_SERVER]: AppHttpServer }> {
  imports = [ConfigModule, LoggerModule, CacheModule];
  exports = [HTTP_SERVER];
  declares = [
    HttpCacheInterceptor,
    { map: HTTP_EXCEPTION_HANDLER, to: AppHttpExceptionHandler },
    { map: HTTP_SERVER, to: AppHttpServer },
  ];
}
