import fs from 'fs/promises';
import { LoggerMessage, LogSeverity, logSeverityPrefixMap } from './logger.model';
import { debounce } from '../utils';
import { logErrorToConsole } from './console-logger';

interface FileLoggerOptions {
  path: string;
  debounceTime?: number;
  filename?: string;
}

export class FileLogger {
  private readonly path: string;
  private readonly defaultOptions = {
    debounceTime: 1000,
    filename: 'logs.txt'
  };
  private logQueue: LoggerMessage[] = [];
  private readonly writeFromQueueDebounced: () => void;

  constructor(private options: FileLoggerOptions) {
    this.options = { ...this.defaultOptions, ...options };
    this.path = `${options.path}/${this.options.filename}`;

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

  private writeFromQueue(): void {
    const logs = this.logQueue.map(([severity, ...message]) => {
      return `${logSeverityPrefixMap[severity as LogSeverity]}: ${message}`
    }).reduce((messages, message) => messages += `${message}\n`, '');

    this.logQueue = [];
    this.writeToFile(logs);
  }

  private async writeToFile(content: string): Promise<void> {
    try {
      await fs.appendFile(this.path, content, { encoding: 'utf8' });
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
}

