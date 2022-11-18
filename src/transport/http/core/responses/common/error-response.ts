import { CommonHttpResponse } from './common-response';
import { ErrorResponseModel } from './response.model';

export class CommonErrorResponse<TCode extends number> extends CommonHttpResponse<TCode>{
  protected _message: string;

  public message(message: string): this {
    this._message = message;

    return this;
  }

  public get(): ErrorResponseModel {
    return {
      error: {
        code: this.code,
        message: this._message
      }
    };
  }

  public send(): void {
    super.send();
  }
}
