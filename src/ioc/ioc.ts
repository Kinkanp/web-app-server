import { Container } from 'inversify';
import { IAppModule } from './ioc.model';

export class AppModule {
  static register(modules: typeof IAppModule[]): void {
    modules.forEach(module => {
      const deps = module.requires().map(dep => dep.getContainer()) as Container[];
      // TODO: remove extra container
      const container = Container.merge(new Container(), new Container(), ...deps) as Container;

      module.register(container);
    });
  }
}