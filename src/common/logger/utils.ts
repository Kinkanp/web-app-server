export enum LogSeverity {
  INFO,
  WARN,
  ERROR,
  DEBUG
}

const colors = {
  [LogSeverity.ERROR]: '\x1b[31m%s\x1b[0m',
  [LogSeverity.INFO]: '\x1b[34m%s\x1b[0m',
  [LogSeverity.WARN]: '\x1b[33m%s\x1b[0m',
  [LogSeverity.DEBUG]: '\x1b[36m%s\x1b[0m'
}

export function log(severity: LogSeverity, ...message: string[]): void {
  const color = colors[severity];
  console.log(color, ...message);
}

export function logError(...message: any[]) {
  log(LogSeverity.ERROR, ...message);
}
