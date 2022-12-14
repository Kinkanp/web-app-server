import { CommonHttpResponse } from './common-response';
import { SuccessResponseModel } from './response.model';

export abstract class CommonSuccessResponse<TCode extends number> extends CommonHttpResponse<TCode>{
  public contentType(type: string): this {
    this._contentType = type;

    return this;
  }

  public get(data: unknown): SuccessResponseModel {
    if (data == null) {
      return null;
    }

    return { data };
  }
}
