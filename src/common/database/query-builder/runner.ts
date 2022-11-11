import { DBConnection } from '../database.model';

export abstract class Runner {
  // constructor(protected connection: Connection, protected table: string) {
  // }
  public run() {
    throw new Error('Runner.run: Not Implemented')
  }
}
