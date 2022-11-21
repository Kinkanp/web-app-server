import { DatabaseTypes } from '../../common/database';

export const USER_SCHEMA = {
  id: {
    type: DatabaseTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  firstName: {
    type: DatabaseTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DatabaseTypes.STRING,
    allowNull: false
  }
};

export const USER_TABLE_OPTIONS = {
  modelName: 'User',
  tableName: 'users',
  timestamps: true,
}
