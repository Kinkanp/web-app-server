import { AppModuleDeclare, AppModuleExport, AppModuleImports, ModuleConstructor } from './ioc.constants';

interface Params {
  exports?: AppModuleExport;
  declares?: AppModuleDeclare;
  imports?: AppModuleImports;
}

// todo: doesn't work
export function Module(params: Params) {
  return function<T extends ModuleConstructor>(constructor: T) {
    // constructor.imports = params.imports;
    // constructor.prototype.exports = params.exports;
    // constructor.prototype.declares = params.declares;
    constructor.prototype.declares = params.declares;
    // (constructor as any).prodeclares = params.declares;
  }
}
