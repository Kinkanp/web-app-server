import { LoggerMessage } from '@packages/logger';

export interface IAppLogger {
  info(scope: string, ...message: LoggerMessage): void;
  error(...message: LoggerMessage): void;
  warning(...message: LoggerMessage): void;
  debug(...message: LoggerMessage): void;
}
