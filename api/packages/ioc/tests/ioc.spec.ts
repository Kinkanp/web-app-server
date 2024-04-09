import 'reflect-metadata';
import { test, expect, describe } from 'vitest';
import { BattleFieldModule } from './data/multiple-modules/battle-field';
import { BerserkModule } from './data/multiple-modules/warriors/berserk';
import { WeaponModule } from './data/multiple-modules/weapon';
import { NinjaModule } from './data/multiple-modules/warriors/ninja';
import { LoggerModule } from './data/multiple-modules/logger';
import { SuperSpeedModule } from './data/multiple-modules/superpowers/super-speed-power';
import { FirePowerModule } from './data/multiple-modules/superpowers/fire-power';
import { injectModule, registerModules } from '../index';
import { FluentSyntaxModule } from './data/fluent-syntax/fluent-syntax.module';
import { FLUENT_SERVICE_C_SYMBOL } from './data/fluent-syntax/constants';

describe('inversion of control module', () => {
  test('should register all modules', () => {
    const modules = [
      BattleFieldModule,
      BerserkModule,
      WeaponModule,
      NinjaModule,
      LoggerModule,
      SuperSpeedModule,
      FirePowerModule
    ];

    expect(() => registerModules(modules)).not.toThrow();
  });

  test('should register modules with fluent syntax', () => {
    const modules = [FluentSyntaxModule];

    expect(async () => {
      await registerModules(modules);
      injectModule(FluentSyntaxModule).import(FLUENT_SERVICE_C_SYMBOL);
    }).not.toThrow();
  });

  test.todo('async declaration');
  test.todo('check injected values');
})
