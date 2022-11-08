import { Connection } from '../database.model';
import { Runner } from './runner';

export class Count implements Runner {
  constructor(
    private connection: Connection,
    private table: string,
    private readonly column = '*'
  ) {
  }

  public async run() {
    try {
      const query = 'SELECT COUNT($1) FROM $2';
      const values = [this.column, this.table];
      const { rows } = await this.connection.query(query, values);
      const [row] = rows;

      return parseInt(row.count, 10);
    } catch (e) {
      // TODO: handle error
      console.error('Count query error', e);
    }
  }
}
