import {
  DBConnection,
  EntityModel,
  EntityCreationOptional,
  InferEntityAttributes,
  InferEntityCreationAttributes
} from '../../common/database';
import { USER_SCHEMA, USER_TABLE_OPTIONS } from './user.schema';

export class User extends EntityModel<InferEntityAttributes<User>, InferEntityCreationAttributes<User>> {
  declare id: EntityCreationOptional<string>;
  declare firstName: string;
  declare lastName: string;

  public static setup(connection: DBConnection): void {
    User.setupEntity(USER_SCHEMA, { ...USER_TABLE_OPTIONS, connection });
  }
}
