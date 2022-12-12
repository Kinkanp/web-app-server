import { v4 as uuidv4 } from 'uuid';
import { AppModule } from '../../ioc';

export const UUID = Symbol('uuid');

export interface Uuid {
  v4(): string
}

export class UuidModule extends AppModule {
  protected exports = [UUID];

  public register(): void {
    this.bind<Uuid>(UUID).toConstantValue({
      v4: () => uuidv4()
    });
  }
}
