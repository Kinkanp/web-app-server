import 'reflect-metadata';
import './common/mocks';
import { App } from '../src/main';

afterAll(() => App.shutdown())