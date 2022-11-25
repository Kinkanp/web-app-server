import { injectable } from 'inversify';

export const LOGGER = Symbol('App logger');

export interface ILogger {
  info(message: string): void;
  error(message: string): void;
  warning(message: string): void;
}

@injectable()
export class Logger implements ILogger {
  public error(message: string): void {
    if (this.canLog()) {
      console.error(`Error: ${message}`)
    }
  }

  public warning(message: string): void {
    if (this.canLog()) {
      console.log(`Warn: ${message}`)
    }
  }

  public info(message: string): void {
    if (this.canLog()) {
      console.log(`Info: ${message}`)
    }
  }

  // TODO: provide from env
  private canLog(): boolean {
    return true;
  }
}
