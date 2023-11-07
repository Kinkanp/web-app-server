import fs from 'fs/promises';
import { LOGGER_SEPARATOR, LoggerMessage, LogSeverity, logSeverityPrefixMap } from './logger.model';
import { logErrorToConsole } from './console-logger';
import { debounce } from './utils/debounce';

interface FileLoggerOptions {
  path: string;
  debounceTime?: number;
  filename?: string;
}

export class FileLogger {
  private readonly defaultOptions = {
    debounceTime: 1000
  };
  private logQueue: LoggerMessage[] = [];
  private readonly writeFromQueueDebounced: () => void;

  constructor(private options: FileLoggerOptions) {
    this.options = { ...this.defaultOptions, ...options };

    this.createLogsFolder(this.options.path)

    this.writeFromQueueDebounced = debounce(
      this.writeFromQueue.bind(this),
      this.options.debounceTime as number
    );
  }

  public write(severity: LogSeverity, ...message: LoggerMessage): void {
    this.logQueue.push([severity, ...message]);
    this.writeFromQueueDebounced();
  }

  private async writeFromQueue(): Promise<void> {
    const logs = this.logQueue.map(([severity, ...message]) => {
      return `${logSeverityPrefixMap[severity as LogSeverity]}: ${message.join(LOGGER_SEPARATOR)}`
    }).reduce((messages, message) => messages += `${message}\n`, '');

    this.logQueue = [];

    this.writeToFile(logs);
  }

  private async writeToFile(content: string): Promise<void> {
    try {
      const filePath = this.createLogsFilename();
      await fs.appendFile(filePath, content, { encoding: 'utf8' });
    } catch(e) {
      logErrorToConsole('Unable to write logs file', e);
    }
  }

  private async createLogsFolder(dirPath :string): Promise<void> {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath);
    }
  }

  private createLogsFilename(): string {
    const date = new Date().toLocaleDateString('en-CA');

    return `${this.options.path}/${date}.txt`;
  }
}

