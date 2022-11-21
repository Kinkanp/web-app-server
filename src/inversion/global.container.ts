import 'reflect-metadata';
import { Container } from 'inversify';

interface Provider<T> {
  new (...args: any): T;
}

export class AppContainer {
  private static container = new Container();

  static createAppModule(): void {
    //
  }

  static setProvider<T>(token: symbol, provider: Provider<T>): typeof AppContainer {
    AppContainer.container.bind<T>(token).to(provider);

    return AppContainer;
  }

  static setConstant<T>(token: symbol, constant: T): typeof AppContainer {
    AppContainer.container.bind<T>(token).toConstantValue(constant);

    return AppContainer;
  }

  static get<T>(token: symbol): T {
    return AppContainer.container.get<T>(token);
  }

  static create(): Container {
    const container = new Container();

    container.parent = AppContainer.container;

    return container;
  }
}
