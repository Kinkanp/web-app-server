export type SuccessResponseModel<TData = any> = SuccessResponse<TData> | null;

export interface ErrorResponseModel {
  error: ResponseError;
}

export interface ResponseError {
  code: number;
  message: ResponseErrorMessage;
}

export type ResponseErrorMessage = string | string[];

interface SuccessResponse<TData> {
  data: TData;
}
