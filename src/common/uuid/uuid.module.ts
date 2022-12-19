import { v4 as uuidv4 } from 'uuid';
import { AppModule } from '@packages/ioc';

export const UUID = Symbol('uuid');

export interface Uuid {
  v4(): string
}

export class UuidModule extends AppModule {
  protected declares = [
    { map: UUID, to: { v4: () => uuidv4() } }
  ];
  protected exports = [UUID];
}
