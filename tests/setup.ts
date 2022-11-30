import 'reflect-metadata';
import './common/mocks';
import { App } from '../src/main';
import { afterEach } from 'vitest';

afterEach(() => {
  return App.shutdown().then();
})