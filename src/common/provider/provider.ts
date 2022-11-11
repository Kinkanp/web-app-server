import { DBConnection } from '../database';
import { Controller } from './controller';
import { EntityService } from './service';
import { EntityRepository } from './repository';

export interface EntityProvider {
  init(connection: DBConnection): Promise<void>;

  readonly controller: Controller;
  readonly service: EntityService;
  readonly repository: EntityRepository;
}

export interface EntityProviderConstructor {
  new(): EntityProvider;
}

export class ProvidersManager {
  private static providers: EntityProvider[] = [];

  static set(providers: EntityProviderConstructor[]): typeof ProvidersManager {
    providers.forEach(Provider => {
      const provider = new Provider();

      ProvidersManager.providers.push(provider);
    });

    return ProvidersManager;
  }

  static init(connection: DBConnection): Promise<void[]> {
    const init = ProvidersManager.providers.map(provider => provider.init(connection));

    return Promise.all([...init]);
  }

  static get<T>(provider: EntityProviderConstructor): EntityProvider & T {
    const relevantProvider = ProvidersManager.providers.find(registeredProvider => registeredProvider instanceof provider);
    return relevantProvider as EntityProvider & T;
  }
}
