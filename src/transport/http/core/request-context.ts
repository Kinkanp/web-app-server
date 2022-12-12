type ContextValue<TRequestContext> = Pick<TRequestContext, keyof TRequestContext>;

export class RequestContext<TRequestContext = unknown> {
  private value = new Map<string, ContextValue<TRequestContext>>();

  public reset() {
    this.value.clear();
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
