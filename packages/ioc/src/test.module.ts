import { injectable, interfaces } from 'inversify';
import { AppModule } from './ioc.model';
import { injectModule, registerModules } from '../index';
import { AppModuleDeclare, AppModuleExport, AppModuleImports } from './ioc.constants';

type RegisterModuleFn  = (bind: interfaces.Bind) => RegisterModuleFnResult | void;

interface RegisterModuleFnResult {
  exports?: AppModuleExport;
  imports?: AppModuleImports;
  declare?: AppModuleDeclare;
}

export const createTestingModule = (register: RegisterModuleFn): AppModule => {
  @injectable()
  class TestModule extends AppModule {
    public register() {
      const result = register(this.bind.bind(this));

      this.exports = result?.exports || [];
      this.imports = result?.imports || [];
      this.declares = result?.declare || [];
      super.register();
    }
  }

  registerModules([TestModule]);

  return injectModule(TestModule);
};
