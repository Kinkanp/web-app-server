export interface ICacheService {
  get<T>(key: string): Promise<T | null>;
  set(key: string, data: unknown, options?: CacheOptions): Promise<void>;
}

export interface CacheOptions {
  ttl: number;
}
