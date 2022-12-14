import { TYPES } from './types';
import { AppModule } from '../../src/ioc.model';
import { injectable } from 'inversify';

export class LoggerModule extends AppModule {
  protected exports = [TYPES.Logger];

  public register() {
    this.bind(TYPES.Logger).to(Logger);
  }
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
