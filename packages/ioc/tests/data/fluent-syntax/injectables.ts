import { inject, injectable } from 'inversify';
import { FLUENT_SERVICE_A_SYMBOL } from './constants';

@injectable()
export class FluentServiceA {
}

@injectable()
export class FluentServiceB {
  constructor(
    @inject(FLUENT_SERVICE_A_SYMBOL) private a: FluentServiceA
  ) {
  }
}

@injectable()
export class FluentServiceC {
  constructor(
    @inject(FLUENT_SERVICE_A_SYMBOL) private a: FluentServiceA,
    @inject(FluentServiceB) private b: FluentServiceB,
  ) {
  }
}
