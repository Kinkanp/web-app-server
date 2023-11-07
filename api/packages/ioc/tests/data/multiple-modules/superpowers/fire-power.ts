import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger, LoggerModule } from '../logger';
import { AppModule } from '../../../../src/ioc.module';
import { SuperPower } from './index';

export class FirePowerModule extends AppModule {
  protected exports = [TYPES.Superpower];
  protected imports = [LoggerModule];

  public register() {
    this.bind(TYPES.Superpower).to(FirePower);
  }
}

@injectable()
export class FirePower implements SuperPower {
  public name = 'fire';
  
  constructor(
    @inject(TYPES.Logger) private logger: ILogger
  ) {
    this.logger.log(`power ${this.name} constructed`)
  }

  public toString(): string {
    return this.name;
  }
}
