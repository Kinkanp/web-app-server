import { HttpResponse } from '../../server.model';
import { HttpResponseUtil } from '../../http-response.util';
import { ErrorResponseModel, SuccessResponseModel } from './response.model';

export abstract class CommonHttpResponse<TCode extends number> {
  protected code: TCode;
  protected _contentType = 'application/json';

  constructor(private res: HttpResponse) {}

  public abstract get(data?: unknown): SuccessResponseModel<TCode> | ErrorResponseModel;

  public status(code: TCode): this {
    this.code = code;

    return this;
  }

  public send(data?: unknown): void {
    new HttpResponseUtil(this.res)
      .contentType(this._contentType)
      .status(this.code)
      .send(this.get(data));
  }
}