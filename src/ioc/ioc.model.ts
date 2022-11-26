import { Container } from 'inversify';

export class IAppModule {
  protected static container: Container;

  static register(container: Container): void {
    throw new Error('Not implemented');
  }

  static requires(): typeof IAppModule[] {
    return [];
  }

  static getContainer(): Container {
    return this.container;
  }
}