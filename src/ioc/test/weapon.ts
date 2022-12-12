import { inject, injectable } from 'inversify';
import { TYPES } from './types';
import { ILogger, LoggerModule } from './logger';
import { AppModule } from '../ioc.model';

export class WeaponModule extends AppModule {
  protected exports = [TYPES.Weapon];
  protected imports = [LoggerModule];

  public register() {
    this.bind(TYPES.Weapon).to(Katana);
  }
}

@injectable()
export class Katana {
  constructor(
    @inject(TYPES.Logger) private logger: ILogger
  ) {
    this.logger.log('weapon constructed')
  }

  public toString(): string {
    return 'Katana';
  }
}
