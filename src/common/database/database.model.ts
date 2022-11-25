import { DataTypes, Model, Optional, Sequelize, DatabaseError as DbError } from 'sequelize';
import { Attributes, ModelAttributes, ModelOptions, ModelStatic } from 'sequelize/types/model';
import { BrandedKeysOf, EntityCreationOptional, UniqueSymbol } from './database.utils';

export class DBConnection extends Sequelize {}

export type EntityAttributes<MS extends ModelStatic<Model>, M extends InstanceType<MS>> = ModelAttributes<M, Optional<Attributes<M>, BrandedKeysOf<Attributes<M>, typeof UniqueSymbol>>>

export class EntityModel<TModelAttributes extends {}, TCreationAttributes extends {} = TModelAttributes> extends Model<TModelAttributes, TCreationAttributes> {
  declare createdAt: EntityCreationOptional<string>;
  declare updatedAt: EntityCreationOptional<string>;

  public static setupEntity<MS extends ModelStatic<Model>, M extends InstanceType<MS>>(
    attributes: EntityAttributes<MS, M>,
    options: ModelOptions,
    sequelize: Sequelize
  ): void {
    EntityModel.init(attributes, { ...options, sequelize });
  }
}

export const DatabaseTypes = DataTypes;

export class DatabaseError extends DbError {}