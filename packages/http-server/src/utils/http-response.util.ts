import { HttpResponse } from '../server';

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
    this.res.writeHead(this.code, {
      'Content-type': this.contentTypeHeader,
      'Access-Control-Allow-Origin': '*'
    });
    this.res.end(formattedData)

    return this;
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
