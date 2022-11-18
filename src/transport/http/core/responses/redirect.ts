import { CommonSuccessResponse } from './common/success-response';

type RedirectCode = 301 | 308 | 302 | 303 | 307 | 300 | 304;

export class RedirectResponse extends CommonSuccessResponse<RedirectCode> {
}
