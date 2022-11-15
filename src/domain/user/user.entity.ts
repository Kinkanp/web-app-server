import {
  EntityModel,
  EntityCreationOptional,
  InferEntityAttributes,
  InferEntityCreationAttributes
} from '../../common/database';

export class User extends EntityModel<InferEntityAttributes<User>, InferEntityCreationAttributes<User>> {
  declare id: EntityCreationOptional<string>;
  declare firstName: string;
  declare lastName: string;
}
