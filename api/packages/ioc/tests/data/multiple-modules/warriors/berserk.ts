import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger, LoggerModule } from '../logger';
import { AppModule } from '../../../../src/ioc.module';
import { WeaponModule } from '../weapon';
import { IWarrior } from './index';
import { FirePowerModule } from '../superpowers/fire-power';
import { SuperPower } from '../superpowers';

export class BerserkModule extends AppModule {
  protected exports = [TYPES.Warrior2];
  protected imports = [WeaponModule, LoggerModule, FirePowerModule];

  public register() {
    this.bind(TYPES.Warrior2).to(Berserk);
  }
}

@injectable()
class Berserk implements IWarrior {
  public name = 'Berserk';

  constructor(
    @inject(TYPES.Weapon) private weapon: string,
    @inject(TYPES.Superpower) private power: SuperPower,
    @inject(TYPES.Logger) private logger: ILogger,
  ) {
    this.logger.log(`warrior constructed: power: ${this.power}`);
  }

  public info() {
    return `I am warrior with a name: ${this.name} and a power: ${this.power}`;
  }
}
