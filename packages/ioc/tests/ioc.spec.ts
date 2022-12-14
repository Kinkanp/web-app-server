import 'reflect-metadata';
import { test, expect } from 'vitest';
import { BattleFieldModule } from './data/battle-field';
import { BerserkModule } from './data/warriors/berserk';
import { WeaponModule } from './data/weapon';
import { NinjaModule } from './data/warriors/ninja';
import { LoggerModule } from './data/logger';
import { SuperSpeedModule } from './data/superpowers/super-speed-power';
import { FirePowerModule } from './data/superpowers/fire-power';
import { registerModules } from '../index';

test('should correctly inject all modules', () => {
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
})
