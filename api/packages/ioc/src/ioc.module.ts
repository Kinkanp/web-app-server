import { Container, interfaces } from 'inversify';
import {
  APP_MODULE_GET_CONTAINER_SYMBOL,
  APP_MODULE_GET_EXPORTS_SYMBOL,
  APP_MODULE_GET_IMPORTS_SYMBOL,
  APP_MODULE_INIT_SYMBOL,
  AppModuleDeclare,
  AppModuleExport,
  AppModuleImports,
  Declare,
  DeclareDirectValue,
  DeclareMappedValue
} from './ioc.constants';
import { isClass } from './utils';

export abstract class AppModule<TExports = any> {
  public register() {
    if (!this.declares.length) {
      throw new Error(`Module ${this.constructor.name} doesn't declare any values`);
    }

    this.declares.forEach(declare => this.bindDeclaredValues(declare));
  }

  protected exports: AppModuleExport = [];
  protected declares: AppModuleDeclare = [];
  protected imports: AppModuleImports = [];
  protected exportsMap = new Map();
  protected bind: interfaces.Bind;

  private container: Container;
  private identifiers: interfaces.ServiceIdentifier[] = [];

  public get [APP_MODULE_GET_EXPORTS_SYMBOL](): AppModuleExport {
    return this.exports;
  }

  public get [APP_MODULE_GET_IMPORTS_SYMBOL](): AppModuleImports {
    return this.imports;
  }

  public [APP_MODULE_INIT_SYMBOL](container: Container): void {
    this.setContainer(container);
    this.register();
    this.initialize();
  }

  public [APP_MODULE_GET_CONTAINER_SYMBOL](): Container {
    return this.container;
  }

  // returns an exported value from the module instance
  public import<T extends keyof TExports = keyof TExports>(key: T): TExports[T] {
    const value = this.exportsMap.get(key);

    if (!value) {
      throw new Error(`Module: ${this.constructor.name} doesn't export: ${key.toString()}`);
    }

    return value;
  }

  // returns a bound value inside module container
  protected inject<T>(identifier: interfaces.ServiceIdentifier<T>): T {
    return this.container.get<T>(identifier);
  }

  private setContainer(container: Container): void {
    this.container = container;

    this.bind = identifier => {
      this.identifiers.push(identifier);
      return this.container.bind(identifier);
    };
  }

  private initialize(): void {
    this.identifiers.forEach(identifier => {
      try {
        const value = this.inject(identifier);

        if (this.exports.includes(identifier)) {
          this.exportsMap.set(identifier, value);
        }
      } catch (error) {
        const moduleName = this.constructor.name;
        throw new Error(`${moduleName}: ${(error as Error).message}`);
      }
    });
  }

  private bindDeclaredValues(declare: Declare): void {
    if (!Object.hasOwn(declare, 'map')) {
      this.bind(declare as DeclareDirectValue).toSelf();

      return;
    }

    const { to, map } = declare as DeclareMappedValue;

    if (isClass(to)) {
      this.bind(map).to(to);
      return;
    }

    if (typeof to === 'function') {
      this.bind(map).toDynamicValue(to as interfaces.DynamicValue<any>);
      return;
    }

    this.bind(map).toConstantValue(to);
  }
}
