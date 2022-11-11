import { DBConnection } from '../database.model';
import { Runner } from './runner';

enum LogicalOperator {
  AND = 'AND',
  OR = 'OR'
}

type WhereOperators = WhereCondition | LogicalOperator;
type RawWhereCondition = Record<string, number | string>;
type SelectFields = string | string[];

class WhereCondition {
  constructor(public key: string, public value: string | number, public sign: string) {}
}

export class Select implements Runner {
  private fields: string;
  private whereConditions: RawWhereCondition[];

  constructor(private connection: DBConnection, private table: string, fields: SelectFields) {
    this.setFields(fields);
  }

  public where(...conditions: RawWhereCondition[]) {
    this.whereConditions = conditions;

    return this;
  }

  groupBy() {
    // Todo: implement
  }

  limit() {
    // Todo: implement
  }

  offset() {
    // Todo: implement
  }

  having() {
    // Todo: implement
  }

  public async run() {
    try {
      const [query, values] = this.construct();
      const { rows } = await this.connection.query(query, values);

      return rows;
    } catch (e) {
      console.error('Select query error', e);
    }
  }

  private construct(): [query: string, values: Array<string | number>] {
    const where = this.parseWhere(this.whereConditions);
    const values: (string | number)[] = [];
    const select = ['SELECT', this.fields, 'FROM', this.table];

    if (where.length) {
      select.push('WHERE');

      where.forEach(condition => {
        if (condition instanceof WhereCondition) {
          select.push(condition.key);
          select.push(condition.sign);
          values.push(condition.value);
          select.push(`$${values.length}`);
        } else {
          select.push(condition);
        }
      });
    }

    return [select.join(' '), values];
  }

  private parseWhere(orConditions: RawWhereCondition[]): WhereOperators[] {
    if (!orConditions?.filter(Boolean).length) {
      return [];
    }

    const result: WhereOperators[] = [];

    orConditions.forEach((condition, index) => {
      const entries = Object.entries(condition);
      const andConditions = entries.map(entry => this.parseWhereValue(...entry));

      if (orConditions.length > 1 && index > 0 && index < orConditions.length) {
        result.push(LogicalOperator.OR);
      }

      andConditions.forEach((andCondition, andIndex) => {
        result.push(andCondition);
        if (andConditions.length > 1 && andIndex < andConditions.length - 1) {
          result.push(LogicalOperator.AND);
        }
      });
    });

    return result;
  }

  private parseWhereValue(key: string, value: string | number): WhereCondition {
    if (typeof value === 'string') {
      const match = value.match(/>=|<=|>|<|=/);
      const hasMatch = match?.length;
      const sign = hasMatch ? match[0] : '=';
      const replacedValue = hasMatch ? value.replace(sign, '') : value;

      return new WhereCondition(key, replacedValue, sign);
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
      return new WhereCondition(key, value, '=');
    }
  }

  private setFields(fields: SelectFields): void {
    this.fields = typeof fields === 'string' ? fields : fields.join(', ');
  }
}
