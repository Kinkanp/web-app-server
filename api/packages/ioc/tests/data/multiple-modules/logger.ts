import { TYPES } from './types';
import { AppModule } from '../../../src/ioc.module';
import { injectable } from 'inversify';

export class LoggerModule extends AppModule {
  protected exports = [TYPES.Logger];
  public declares = [
    { map: TYPES.Logger, to: Logger }
  ]
}

export interface ILogger {
  log(...message: string[]): void;
}

@injectable()
class Logger implements ILogger {
  constructor() {
    this.log('logger constructor');
  }

  public log(...message: string[]): void {
    //
  }
}
