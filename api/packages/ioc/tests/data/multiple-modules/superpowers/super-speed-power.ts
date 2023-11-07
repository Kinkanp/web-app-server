import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger, LoggerModule } from '../logger';
import { AppModule } from '../../../../src/ioc.module';
import { SuperPower } from './index';

export class SuperSpeedModule extends AppModule {
  protected exports = [TYPES.Superpower];
  protected imports = [LoggerModule];

  public register() {
    this.bind(TYPES.Superpower).to(SuperSpeed);
  }
}

@injectable()
export class SuperSpeed implements SuperPower {
  public name = 'super speed';

  constructor(
    @inject(TYPES.Logger) private logger: ILogger
  ) {
    this.logger.log(`power ${this.name} constructed`)
  }

  public toString(): string {
    return this.name;
  }
}
