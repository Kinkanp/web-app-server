import { AppModule, injectModule } from '@packages/ioc';
import { createClient } from 'redis';
import { APP_CONFIG, ConfigModule } from '../config';
import { LOGGER, LoggerModule } from '../logger';
import { CacheService } from './cache.service';
import { ICacheService } from './cache.model';

export const CACHE_SERVICE = Symbol('caching service');
export const MEMORY_STORAGE_CONNECTION = Symbol('memory storage connection');

export class CacheModule extends AppModule<{ [CACHE_SERVICE]: ICacheService }> {
  public exports = [CACHE_SERVICE];
  public imports = [LoggerModule, ConfigModule];
  public declares = [
    { map: CACHE_SERVICE, to: CacheService },
    {
      map: MEMORY_STORAGE_CONNECTION,
      toAsync: async () => {
        const config = injectModule(ConfigModule).import(APP_CONFIG);
        const logger = injectModule(LoggerModule).import(LOGGER);
        const client = createClient({ url: config.memoryStorage.url });

        await client.connect()
          .then(() => logger.info('Creating memory storage connection'))
          .catch((e) => logger.error('Unable to create memory storage connection', e))

        return client;
      }
    }
  ];
}

// export async function cacheble<T>(key: string, data: () => Promise<T>): Promise<T>
// export async function cacheble<T>(key: string, data: T): Promise<T> {
//   const cached = await memoryStorageClient.get(key);
//
//   if (cached) {
//     return JSON.parse(cached) as T;
//   }
//
//   const dataToSave = await typeof data === 'function' ? data : data;
//   const serialized = JSON.stringify(dataToSave)
//
//   memoryStorageClient.set(key, serialized);
//
//   return dataToSave;
// }
