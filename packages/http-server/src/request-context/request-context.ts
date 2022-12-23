type ContextValue<TRequestContext> = Pick<TRequestContext, keyof TRequestContext>;

export interface RequestContextDefaultValues {
  rid: string;
}

export class RequestContext<TRequestContext = unknown> {
  private value = new Map<string, ContextValue<TRequestContext>>();

  constructor(rid: string) {
    this.value.set('rid', rid as unknown as ContextValue<TRequestContext>);
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
