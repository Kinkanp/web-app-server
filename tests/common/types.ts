import 'vitest';
import { Seeds } from  '../../seeds/seed';
import { TestContext } from 'vitest';

declare module 'vitest' {
  export interface TestContext {
    seeds: Seeds
  }
}

export type LocalTestContext = TestContext;
