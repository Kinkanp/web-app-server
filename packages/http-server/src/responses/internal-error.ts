import { CommonErrorResponse } from './common/error-response';

type InternalErrorCode = 500 | 501 | 502 | 503 | 504 | 505;

export class InternalErrorResponse extends CommonErrorResponse<InternalErrorCode> {
  protected _message = 'Uncaught server error';
}
