import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { Attributes, ModelAttributes, ModelOptions, ModelStatic } from 'sequelize/types/model';
import { BrandedKeysOf, UniqueSymbol } from './database-model.utils';

export class DBConnection extends Sequelize {}

export class EntityModel<TModelAttributes, TCreationAttributes> extends Model<TModelAttributes, TCreationAttributes> {
  public static setupEntity<MS extends ModelStatic<Model>, M extends InstanceType<MS>>(
    attributes: ModelAttributes<M, Optional<Attributes<M>, BrandedKeysOf<Attributes<M>, typeof UniqueSymbol>>>,
    options: ModelOptions & { connection: Sequelize }
  ): void {
    EntityModel.init(attributes, { ...options, sequelize: options.connection });
  }
}

export const DatabaseTypes = DataTypes;
