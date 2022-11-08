interface ILogger {
  info(): void;
  error(): void;
  warning(): void;
}

export class Logger implements ILogger{
  public error(): void {
  }

  public warning(): void {
  }

  public info(): void {

  }
}