import { RouteHandlerResponse } from '../routing';

export class HttpInterceptorHandle {
  private result: Promise<RouteHandlerResponse>;

  constructor(private handle: () => Promise<RouteHandlerResponse>) {
  }

  public run(): Promise<RouteHandlerResponse> {
    // make sure that route handler runs only once
    if (this.result) {
      return this.result;
    }

    this.result = this.handle();
    return this.result;
  }
}
