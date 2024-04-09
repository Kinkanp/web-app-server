import { injectable, interfaces } from 'inversify';
import { AppModule } from './ioc.module';
import { injectModule, registerModules } from '../index';
import { AppModuleDeclare, AppModuleExport, AppModuleImports } from './ioc.constants';

type RegisterModuleFn  = (bind: interfaces.Bind) => RegisterModuleFnResult | void;

interface RegisterModuleFnResult {
  exports?: AppModuleExport;
  imports?: AppModuleImports;
  declare?: AppModuleDeclare;
}

// TODO: make it sync
export const createTestingModule: (register: RegisterModuleFn) => Promise<AppModule> = async (register) => {

  @injectable()
  class TestModule extends AppModule {
    public async register() {
      const result = register(this.bind.bind(this));

      this.exports = result?.exports || [];
      this.imports = result?.imports || [];
      this.declares = result?.declare || [];

      return super.register();
    }
  }

  await registerModules([TestModule]);

  return injectModule(TestModule);
};
