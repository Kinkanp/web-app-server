import { HttpResponse } from '../server';

export class HttpResponseUtil {
  private code: number;
  private contentTypeHeader: string;
  private data: unknown;

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
    this.data = data;
    this.res.writeHead(this.code, { 'Content-type': this.contentTypeHeader });
    this.res.end(this.formatData(data))

    return this;
  }

  public get() {
    return {
      data: this.data,
      contentType: this.contentTypeHeader,
      status: this.code
    };
  }

  private formatData(data: unknown): string | number | boolean | symbol | null {
    if (!data) {
      return null;
    }

    if (typeof data === 'object') {
      return JSON.stringify(data);
    }

    return data as string;
  }
}
