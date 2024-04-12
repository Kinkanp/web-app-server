import { AppModule } from './ioc.module';
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

export type DeclareMappedValue = (DeclareMappedValueBase & { to: DeclareValue }) |
  (DeclareMappedValueBase & { toAsync: () => Promise<DeclareValueBase> });

type DeclareMappedValueBase = { map: symbol, to?: DeclareValue, toAsync?: () => Promise<DeclareValueBase> };
type DeclareValueBase = string | number | object;
type DeclareValue = DeclareValueBase | ClassConstructor;

export type AppModuleExport = interfaces.ServiceIdentifier[];
export type AppModuleDeclare = Declare[];
export type AppModuleImports = typeof AppModule<any>[];

export const APP_MODULE_INIT_SYMBOL = Symbol('APP_MODULE_INIT');
export const APP_MODULE_GET_CONTAINER_SYMBOL = Symbol('APP_MODULE_GET_CONTAINER');
export const APP_MODULE_GET_IMPORTS_SYMBOL = Symbol('APP_MODULE_GET_IMPORTS');
export const APP_MODULE_GET_EXPORTS_SYMBOL = Symbol('APP_MODULE_GET_EXPORTS');
