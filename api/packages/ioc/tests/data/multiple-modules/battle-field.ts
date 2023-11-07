import { inject, injectable } from 'inversify';
import { TYPES } from './types';
import { NinjaModule } from './warriors/ninja';
import { ILogger, LoggerModule } from './logger';
import { AppModule } from '../../../src/ioc.module';
import { IWarrior } from './warriors';
import { BerserkModule } from './warriors/berserk';

export interface IBattleField {
  fight(): void;
}

export class BattleFieldModule extends AppModule {
  public imports = [NinjaModule, BerserkModule, LoggerModule];

  public register() {
    this.bind(TYPES.BattleField).to(BattleField).inSingletonScope();
  }

  public fight(): void {
    this.inject<IBattleField>(TYPES.BattleField).fight();
  }
}

@injectable()
class BattleField implements IBattleField {
  constructor(
    @inject(TYPES.Warrior) private warrior: IWarrior,
    @inject(TYPES.Warrior2) private warrior2: IWarrior,
    @inject(TYPES.Logger) private logger: ILogger,
  ) {
    this.logger.log('battlefield constructed');
  }

  public fight() {
    this.logger.log('Let fight begin!');
    this.logger.log(`Warrior: ${this.warrior.info()}`);
    this.logger.log('VERSUS');
    this.logger.log(`Warrior: ${this.warrior2.info()}`);
  }
}

