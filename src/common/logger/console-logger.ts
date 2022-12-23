import { LoggerMessage, LogSeverity, logSeverityPrefixMap } from './logger.model';

const colors = {
  [LogSeverity.ERROR]: '\x1b[31m%s\x1b[0m',
  [LogSeverity.INFO]: '\x1b[34m%s\x1b[0m',
  [LogSeverity.WARN]: '\x1b[33m%s\x1b[0m',
  [LogSeverity.DEBUG]: '\x1b[36m%s\x1b[0m'
}

export function logToConsole(severity: LogSeverity, ...message: LoggerMessage): void {
  const color = colors[severity];

  console.log(color, `${logSeverityPrefixMap[severity]}: `, ...message);
}

export function logErrorToConsole(...message: LoggerMessage) {
  logToConsole(LogSeverity.ERROR, ...message);
}
