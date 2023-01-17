type ContextValue<TRequestContext> = Pick<TRequestContext, keyof TRequestContext>;

export interface RequestContextDefaultValues {
  rid: string;
  ip: string;
}

export class RequestContext<TRequestContext = unknown> {
  private value = new Map<string, ContextValue<TRequestContext>>();

  constructor(params: { rid: string, ip: string }) {
    this.value.set('rid', params.rid as unknown as ContextValue<TRequestContext>);
    this.value.set('ip', params.ip as unknown as ContextValue<TRequestContext>);
  }

  public set(key: string, value: TRequestContext[keyof TRequestContext]): void {
    this.value.set(key, value as ContextValue<TRequestContext>);
  }

  public get<T extends keyof TRequestContext = keyof TRequestContext> (
    key: T
  ): TRequestContext[T] {
    return this.value.get(key as string) as TRequestContext[T];
  }
}
