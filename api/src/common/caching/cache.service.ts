import { inject, injectable, LazyServiceIdentifer } from 'inversify';
import { MEMORY_STORAGE_CONNECTION } from './cache.module';
import { RedisClientType } from 'redis';
import { CacheOptions, ICacheService } from './cache.model';

@injectable()
export class CacheService implements ICacheService {
  constructor(
    @inject(new LazyServiceIdentifer(() => MEMORY_STORAGE_CONNECTION)) private memoryStorage: RedisClientType
  ) {}

  public async get<T>(key: string): Promise<T | null> {
    if (!this.memoryStorage.isOpen || !this.memoryStorage.isReady) {
      return null;
    }

    try {
      const data =  await this.memoryStorage.get(key);

      return data ? JSON.parse(data) as T : null;
    } catch {
      return null;
    }
  }

  public set(key: string, data: unknown, options?: CacheOptions): Promise<void> {
    try {
      const dataString = JSON.stringify(data);

      return this.memoryStorage.set(key, dataString, { EX: options?.ttlInSeconds }).then();
    } catch {
      return Promise.resolve();
    }
  }

  public async delete(key: string): Promise<void> {
    try {
      await this.memoryStorage.del(key);
    } catch(e) {
      return;
    }
  }
}
