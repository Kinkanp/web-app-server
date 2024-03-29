import { HttpResponse } from '../../server';
import { HttpResponseUtil } from '../../utils';
import { ErrorResponseModel, SuccessResponseModel } from './response.model';

export abstract class CommonHttpResponse<TCode extends number> {
  protected code: TCode;
  protected _contentType = 'application/json';

  private response: HttpResponseUtil;

  constructor(private res: HttpResponse) {}

  public abstract get(data?: unknown): SuccessResponseModel<TCode> | ErrorResponseModel;

  public status(code: TCode): this {
    this.code = code;

    return this;
  }

  public send(data?: unknown): void {
    this.response = new HttpResponseUtil(this.res)
      .contentType(this._contentType)
      .status(this.code)
      .send(this.get(data));
  }

  public toString(): string {
    const response =  this.response.get();

    return `status: ${response.status}`;
  }
}
