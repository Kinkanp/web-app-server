export interface ICacheService {
  get<T>(key: string): Promise<T | null>;
  delete(key: string): Promise<void>;
  set(key: string, data: unknown, options?: CacheOptions): Promise<void>;
}

export interface CacheOptions {
  ttlInSeconds: number;
}
