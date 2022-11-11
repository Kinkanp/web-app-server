import { DBConnection } from '../database.model';
import { Count } from './count';
import { Select } from './select';

export class QueryBuilder {
  constructor(private connection: DBConnection, private table: string) {}

  count(column: string) {
    return new Count(this.connection, this.table, column);
  }

  select(fields: string[] | string) {
    return new Select(this.connection, this.table, fields);
  }
}
