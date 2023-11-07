import 'reflect-metadata';
import './common/mocks';
import './common/types';
import { App } from '../src/main';
import { afterEach, beforeAll, beforeEach } from 'vitest';
import { clearSeeds, runSeeds, Seeds } from '../seeds/seed';

let seeds: Seeds;

beforeAll(async () => {
  try {
    seeds = await runSeeds();

    return () => clearSeeds();
  } catch(e) {
    console.log('Tests setup error:', e);
    clearSeeds();
  }
});

beforeEach(context => {
  context.seeds = seeds;
});

afterEach(() => App.shutdown().then());
