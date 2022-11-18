import { HttpResponse } from './server.model';

export class HttpResponseUtil {
  private code: number;
  private contentTypeHeader: string;

  constructor(private res: HttpResponse) {}

  public status(code: number): this {
    this.code = code;

    return this;
  }

  public contentType(type: string): this {
    this.contentTypeHeader = type;

    return this;
  }

  public send(data?: unknown): this {
    const formattedData = this.formatData(data);
    this.res.writeHead(this.code, { 'Content-type': this.contentTypeHeader });
    this.res.end(formattedData)

    return this;
  }

  private formatData(data: unknown): string | number {
    if (!data) {
      return undefined;
    }

    if (typeof data === 'string' || typeof data === 'number') {
      return data;
    }

    return JSON.stringify(data);
  }
}