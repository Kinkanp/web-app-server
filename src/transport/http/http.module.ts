import { HttpExceptionHandler } from './exception-handler';
import { ExceptionHandler } from '@packages/http-server';
import { AppModule } from '@packages/ioc';
import { ConfigModule } from '../../common/config';
import { LoggerModule } from '../../common/logger';
import { AppHttpServer } from './app-http-server';

export const HTTP_SERVER = Symbol('App http server');
export const HTTP_EXCEPTION_HANDLER = Symbol('Http exception handler');

export class HttpModule extends AppModule<{ [HTTP_SERVER]: AppHttpServer }> {
  protected imports = [ConfigModule, LoggerModule];
  protected exports = [HTTP_SERVER];

  public register(): void {
    this.bind<ExceptionHandler>(HTTP_EXCEPTION_HANDLER).to(HttpExceptionHandler);
    this.bind(HTTP_SERVER).to(AppHttpServer)
  }
}
