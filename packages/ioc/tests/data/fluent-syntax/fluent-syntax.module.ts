import { AppModule } from '../../../src/ioc.model';
import { FluentServiceA, FluentServiceB, FluentServiceC } from './injectables';
import { FLUENT_CONSTANT_SYMBOL, FLUENT_SERVICE_A_SYMBOL, FLUENT_SERVICE_C_SYMBOL } from './constants';

export class FluentSyntaxModule extends AppModule<{ [FLUENT_SERVICE_C_SYMBOL]: FluentServiceC }> {
  public declares = [
    {
      map: FLUENT_SERVICE_A_SYMBOL,
      to: FluentServiceA
    },
    { map: FLUENT_CONSTANT_SYMBOL, to: 999_999 },
    FluentServiceB,
    { map: FLUENT_SERVICE_C_SYMBOL, to: FluentServiceC }
  ];

  public exports = [FLUENT_SERVICE_C_SYMBOL];
}
