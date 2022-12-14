import { CommonErrorResponse } from './common/error-response';

type ClientErrorCode = 400 | 401 | 402 | 403 | 404 | 422 | 423 | 429;

export class ClientErrorResponse extends CommonErrorResponse<ClientErrorCode> {
}
