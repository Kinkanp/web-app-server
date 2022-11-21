export interface SuccessResponseModel<TData = any> {
  data: TData;
}

export interface ErrorResponseModel {
  error: ResponseError;
}

export interface ResponseError {
  code: number;
  message: ResponseErrorMessage;
}

export type ResponseErrorMessage = string | string[];