import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger, LoggerModule } from '../logger';
import { AppModule } from '../../../src/ioc.model';
import { WeaponModule } from '../weapon';
import { SuperSpeedModule } from '../superpowers/super-speed-power';
import { IWarrior } from './index';
import { SuperPower } from '../superpowers';

export class NinjaModule extends AppModule {
  protected exports = [TYPES.Warrior];
  protected imports = [WeaponModule, LoggerModule, SuperSpeedModule];

  public register() {
    this.bind(TYPES.Warrior).to(Ninja);
  }
}

@injectable()
class Ninja implements IWarrior {
  public name = 'Ninja';

  constructor(
    @inject(TYPES.Weapon) private weapon: string,
    @inject(TYPES.Superpower) private power: SuperPower,
    @inject(TYPES.Logger) private logger: ILogger,
  ) {
    this.logger.log(`warrior constructed: power: ${this.power}`);
  }

  public info(): string {
    return `I am warrior with a name: ${this.name} and a power: ${this.power}`;
  }
}
