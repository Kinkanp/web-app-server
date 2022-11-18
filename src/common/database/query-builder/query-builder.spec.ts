import { QueryBuilder } from './query-builder';

xdescribe('Query Builder', () => {
  const TABLE_NAME = 'test_table';

  describe('count', () => {
    const COUNT_QUERY = 'SELECT COUNT($1) FROM $2';
    const COUNT = 25;
    const connectionMock = {
      query: jest.fn().mockImplementation(() => {
        return Promise.resolve({ rows: [{ count: COUNT }] });
      })
    };

    test('should return count number', async () => {
      const qb = new QueryBuilder(connectionMock, TABLE_NAME);
      const result = await qb.count().run();

      expect(result).toEqual(COUNT);
    });

    test('should run count query with `*`', async () => {
      const qb = new QueryBuilder(connectionMock, TABLE_NAME);
      const COLUMNS = '*';
      const values = [COLUMNS, TABLE_NAME];

      await qb.count(COLUMNS).run();

      expect(connectionMock.query).toHaveBeenCalledWith(COUNT_QUERY, values);
    });

    test('should run count query with specific field', async () => {
      const qb = new QueryBuilder(connectionMock, TABLE_NAME);
      const COLUMNS = 'ID';
      const values = [COLUMNS, TABLE_NAME];

      await qb.count(COLUMNS).run();

      expect(connectionMock.query).toHaveBeenCalledWith(COUNT_QUERY, values);
    });
  });

  describe('select', () => {
    const data = [
      { id: 1, value: 2, name: 'a' },
      { id: 2, value: 3, name: 'b' },
      { id: 3, value: 4, name: 'c' }
    ];
    const connectionMock = {
      query: jest.fn().mockImplementation(() => {
        return Promise.resolve({ rows: data });
      })
    };

    test('should return data', async () => {
      const qb = new QueryBuilder(connectionMock, TABLE_NAME);
      const result = await qb.select().run();

      expect(result).toEqual(data);
    });

    test('should use default params', async () => {
      const qb = new QueryBuilder(connectionMock, TABLE_NAME);
      const query = `SELECT * FROM ${TABLE_NAME}`;
      await qb.select().run();

      expect(connectionMock.query).toHaveBeenCalledWith(query, []);
    });

    test('select fields', async () => {
      const qb = new QueryBuilder(connectionMock, TABLE_NAME);
      const fields = ['field_3', 'field_2', 'field_3'];
      const query = `SELECT ${fields.join(', ')} FROM ${TABLE_NAME}`;

      await qb.select(fields).run();

      expect(connectionMock.query).toHaveBeenCalledWith(query, []);
    });

    describe('select where', () => {
      test('where with `AND` params', async () => {
        const qb = new QueryBuilder(connectionMock, TABLE_NAME);
        const ID = 1;
        const params = { id: `>=${ID}`, login: 'qwe' };
        const query = `SELECT * FROM ${TABLE_NAME} WHERE id >= $1 AND login = $2`;
        const values = [String(ID), params.login];

        await qb.select().where(params).run();

        expect(connectionMock.query).toHaveBeenCalledWith(query, values);
      });

      test('where with `OR` params', async () => {
        const qb = new QueryBuilder(connectionMock, TABLE_NAME);
        const param1 = { age: 30 };
        const param2 = { login: 'qwe' };
        const query = `SELECT * FROM ${TABLE_NAME} WHERE age = $1 OR login = $2`;
        const values = [param1.age, param2.login];

        await qb.select().where(param1, param2).run();

        expect(connectionMock.query).toHaveBeenCalledWith(query, values);
      });

      test('where with `AND` and `OR` params', async () => {
        const qb = new QueryBuilder(connectionMock, TABLE_NAME);
        const ID = 1;
        const andParams = { id: `>=${ID}`, age: 30 };
        const orParams = { login: 'qwe' };
        const query = `SELECT * FROM ${TABLE_NAME} WHERE id >= $1 AND age = $2 OR login = $3`;
        const values = [String(ID), andParams.age, orParams.login];

        await qb.select().where(andParams, orParams).run();

        expect(connectionMock.query).toHaveBeenCalledWith(query, values);
      });

      test('where with multiple params', async () => {
        const qb = new QueryBuilder(connectionMock, TABLE_NAME);
        const ID = 1;
        const AGE = 18;
        const andParams = {
          id: `>=${ID}`,
          login: 'qwe',
          username: 'name',
          password: '123',
          tag: 'superuser'
        };
        const orParams = { role: 'admin', age: `<=${AGE}` };
        const query = `SELECT * FROM ${TABLE_NAME} WHERE id >= $1 AND login = $2 AND username = $3 AND password = $4 AND tag = $5 OR role = $6 AND age <= $7`;
        const values = [String(ID), andParams.login, andParams.username, andParams.password, andParams.tag, orParams.role, String(AGE)];

        await qb.select().where(andParams, orParams).run();

        expect(connectionMock.query).toHaveBeenCalledWith(query, values);
      });
    });
  });
});
