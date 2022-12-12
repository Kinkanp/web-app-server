import { inject, injectable } from 'inversify';
import { APP_CONFIG, AppConfig } from '../config';
import { log, LogSeverity } from './utils';

export const LOGGER = Symbol('App logger');

type Message = any[];

export interface ILogger {
  info(scope: string, ...message: Message): void;
  error(...message: Message): void;
  warning(...message: Message): void;
  debug(...message: Message): void;
}

@injectable()
export class Logger implements ILogger {
  constructor(
    @inject(APP_CONFIG) private config: AppConfig
  ) {
  }

  public error(...message: Message): void {
    if (this.canLog()) {
      log(LogSeverity.ERROR, 'ERROR: ', ...message);
    }
  }

  public warning(...message: Message): void {
    if (this.canLog()) {
      log(LogSeverity.WARN, 'WARN: ', ...message);
    }
  }

  public info(...message: Message): void {
    if (this.canLog()) {
      log(LogSeverity.INFO, 'INFO: ', ...message);
    }
  }

  public debug(...message: Message): void {
    if (this.config.environment.isDev) {
      log(LogSeverity.DEBUG, 'DEBUG: ', ...message);
    }
  }

  // TODO: provide from env
  private canLog(): boolean {
    return true;
  }
}
