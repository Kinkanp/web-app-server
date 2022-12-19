import { IoC } from './src/ioc';

export { AppModule } from './src/ioc.model';
export { createTestingModule } from './src/test.module';
export const registerModules = IoC.register.bind(IoC);
export const injectModule = IoC.injectModule.bind(IoC);
export const enableDebug = () => IoC.setOptions({ debug: true });
