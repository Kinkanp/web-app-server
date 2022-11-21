import { injectable } from 'inversify';

export interface ILogger {
  info(message: string): void;
  error(message: string): void;
  warning(message: string): void;
}

@injectable()
export class Logger implements ILogger {
  public error(message: string): void {
    if (this.canLog()) {
      console.log(`Error: ${message}`)
    }
  }

  public warning(message: string): void {
    if (this.canLog()) {
      console.log(`Warn: ${message}`)
    }
  }

  public info(message: string): void {
    if (this.canLog()) {
      console.log(`info: ${message}`)
    }
  }

  private canLog(): boolean {
    return false;
  }
}