import { inject, injectable } from 'inversify';
import { APP_CONFIG, AppConfig } from '../config';
import { logToConsole } from './console-logger';
import { ILogger, LoggerMessage, LoggerOptions, LogSeverity } from './logger.model';
import { FileLogger } from './file-logger';

@injectable()
export class Logger implements ILogger {
  private options: LoggerOptions;
  private readonly fileLogger: FileLogger | null;

  constructor(
    @inject(APP_CONFIG) config: AppConfig
  ) {
    this.options = {
      debug: config.environment.isDev,
      logsPath: config.app.logsPath,
      logToConsole: true,
      logToFile: true
    };

    if (this.options.logsPath) {
      this.fileLogger = new FileLogger({ path: this.options.logsPath });
    }
  }

  public error(...message: LoggerMessage): void {
    this.onLog(
      () => logToConsole(LogSeverity.ERROR, ...message),
      () => this.writeToFile(LogSeverity.ERROR)
    );
  }

  public warning(...message: LoggerMessage): void {
    this.onLog(
      () => logToConsole(LogSeverity.WARN, ...message),
      () => this.writeToFile(LogSeverity.WARN, ...message)
    );
  }

  public info(...message: LoggerMessage): void {
    this.onLog(
      () => logToConsole(LogSeverity.INFO, ...message),
      () => this.writeToFile(LogSeverity.INFO, ...message)
    );
  }

  public debug(...message: LoggerMessage): void {
    this.onLog(
      () => {
        if (this.options.debug) {
          logToConsole(LogSeverity.DEBUG, ...message);
        }
      },
      () => null
    );
  }

  private onLog(consoleLog: () => void, fileLog: () => void) {
    if (this.disable()) {
      return;
    }

    if (this.shouldWriteToConsole()) {
      consoleLog();
    }

    if (this.shouldWriteToFile()) {
      fileLog();
    }
  }

  private shouldWriteToConsole(): boolean {
    return this.options.logToConsole;
  }

  private shouldWriteToFile(): boolean {
    return this.options.logToFile;
  }

  private writeToFile(severity: LogSeverity, ...message: LoggerMessage): void {
    if (this.fileLogger) {
      this.fileLogger.write(severity, ...message);
    }
  }

  // TODO: provide from env
  private disable(): boolean {
    return false;
  }
}
