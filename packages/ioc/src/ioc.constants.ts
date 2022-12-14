import { AppModule } from './ioc.model';
import { interfaces } from 'inversify';

export interface IocOptions {
  debug?: boolean;
}

export type AppModuleExports = interfaces.ServiceIdentifier[];
export type AppModuleImports = typeof AppModule<any>[];

export const APP_MODULE_INIT_SYMBOL = Symbol('APP_MODULE_INIT');
export const APP_MODULE_GET_CONTAINER_SYMBOL = Symbol('APP_MODULE_GET_CONTAINER');
export const APP_MODULE_GET_IMPORTS_SYMBOL = Symbol('APP_MODULE_GET_IMPORTS');
export const APP_MODULE_GET_EXPORTS_SYMBOL = Symbol('APP_MODULE_GET_EXPORTS');
