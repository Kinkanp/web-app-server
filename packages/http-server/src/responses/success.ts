import { CommonSuccessResponse } from './common/success-response';

type SuccessResponseCode = 200 | 201 | 202 | 203 | 204;

export class SuccessResponse extends CommonSuccessResponse<SuccessResponseCode> {
}
