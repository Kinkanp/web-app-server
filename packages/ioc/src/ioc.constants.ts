import { AppModule } from './ioc.model';
import { interfaces } from 'inversify';

export interface IocOptions {
  debug?: boolean;
}

export type ModuleConstructor = ClassConstructor<AppModule>;

export interface ClassConstructor<T = any> {
  new (...args: any): T;
}

export type Declare = DeclareMappedValue | DeclareDirectValue;

export type DeclareDirectValue = ClassConstructor;

export type DeclareMappedValue = { map: symbol; to: DeclareValue };

type DeclareValue = string | number | object | ClassConstructor;

export type AppModuleExport = interfaces.ServiceIdentifier[];
export type AppModuleDeclare = Declare[];
export type AppModuleImports = typeof AppModule<any>[];

export const APP_MODULE_INIT_SYMBOL = Symbol('APP_MODULE_INIT');
export const APP_MODULE_GET_CONTAINER_SYMBOL = Symbol('APP_MODULE_GET_CONTAINER');
export const APP_MODULE_GET_IMPORTS_SYMBOL = Symbol('APP_MODULE_GET_IMPORTS');
export const APP_MODULE_GET_EXPORTS_SYMBOL = Symbol('APP_MODULE_GET_EXPORTS');
