import { Container } from 'inversify';
import { getBindingDictionary } from 'inversify/lib/planning/planner';
import {
  APP_MODULE_GET_CONTAINER_SYMBOL,
  APP_MODULE_GET_EXPORTS_SYMBOL,
  APP_MODULE_GET_IMPORTS_SYMBOL,
  APP_MODULE_INIT_SYMBOL,
  IocOptions,
  ModuleConstructor
} from './ioc.constants';
import { AppModule } from './ioc.module';

export class IoC {
  private static builtModules: AppModule[];
  private static options: IocOptions = { debug: false };

  static setOptions(options: IocOptions = {}): void {
    this.options = options;
  }

  static injectModule<T extends ModuleConstructor>(module: T): InstanceType<T> {
    return this.getInstanceOf(module) as InstanceType<T>;
  }

  static register(modules: ModuleConstructor[]): void {
    this.builtModules = this.buildModules(modules);
    const orderedModule = this.orderModulesByImports(this.builtModules);

    for (const module of orderedModule) {
      const container = new Container({ defaultScope: 'Singleton', autoBindInjectable: false });
      const dict = getBindingDictionary(container);

      for (const moduleImport of module[APP_MODULE_GET_IMPORTS_SYMBOL]) {
        const dependency = this.getInstanceOf(moduleImport);
        const dependencyContainer = dependency[APP_MODULE_GET_CONTAINER_SYMBOL]();
        const dependencyDict = getBindingDictionary(dependencyContainer);

        for (const exportIdentifier of dependency[APP_MODULE_GET_EXPORTS_SYMBOL]) {
          const [value] = dependencyDict.get(exportIdentifier);

          dict.add(exportIdentifier, value);
          this.debug(`Adding ${exportIdentifier.toString()} to ${module.constructor.name}`);
        }
      }

      module[APP_MODULE_INIT_SYMBOL](container);

      // prevent iteration if debug is off
      if (this.options.debug) {
        this.debug(
          module.constructor.name,
          'id:', module[APP_MODULE_GET_CONTAINER_SYMBOL]()?.id,
          'imports: ',
          module[APP_MODULE_GET_IMPORTS_SYMBOL].map(dep => {
            const container = this.getInstanceOf(dep)[APP_MODULE_GET_CONTAINER_SYMBOL]();
            return container.id;
          }),
          '\n'
        );
      }
    }
  }

  private static buildModules(modules: ModuleConstructor[]): AppModule[] {
    return modules.map(Module => new Module());
  }

  private static getInstanceOf(module: typeof AppModule): AppModule {
    return this.builtModules.find(built => built instanceof module)!;
  }

  private static orderModulesByImports(modules: AppModule[]): AppModule[] {
    const ordered: AppModule[] = [];
    const pending: AppModule[] = [...modules];

    let i = 0;

    while (pending.length) {
      const module = pending[i];

      const depsOrdered = module[APP_MODULE_GET_IMPORTS_SYMBOL].every(dep => {
        const built = this.getInstanceOf(dep);

        if (!built) {
          throw new Error(`
            Module ${dep.name} cannot be found.
            Required by ${module.constructor.name}
          `)
        }

        return ordered.includes(built);
      });

      if (depsOrdered) {
        ordered.push(module);
        pending.splice(i, 1);
        i = 0;
      } else {
        i++;

        if (i > pending.length - 1) {
          throw new Error(`
            Circle dependency detected: module: ${module.constructor.name},
            Unable to resolve: ${pending.map(m => m.constructor.name)}
          `);
        }
      }
    }

    return ordered;
  }

  private static debug(...messages: unknown[]): void {
    if (this.options.debug) {
      console.log(...messages);
    }
  }
}
