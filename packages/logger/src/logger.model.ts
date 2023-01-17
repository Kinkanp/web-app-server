export type LoggerMessage = any[];

export interface ILogger {
  info(scope: string, ...message: LoggerMessage): void;
  error(...message: LoggerMessage): void;
  warning(...message: LoggerMessage): void;
  debug(...message: LoggerMessage): void;
}

export interface LoggerOptions {
  logsPath: string;
  debug: boolean;
  logToConsole: boolean;
  logToFile: boolean;
}

export enum LogSeverity {
  INFO,
  WARN,
  ERROR,
  DEBUG
}

export const logSeverityPrefixMap = {
  [LogSeverity.INFO]: 'INFO',
  [LogSeverity.WARN]: 'WARN',
  [LogSeverity.ERROR]: 'ERROR',
  [LogSeverity.DEBUG]: 'DEBUG'
}

export const LOGGER_SEPARATOR = ' -> ';
