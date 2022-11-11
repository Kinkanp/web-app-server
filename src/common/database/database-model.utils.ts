import { Model } from 'sequelize';
import { AnyFunction } from 'sequelize/types/utils';

export type InferEntityAttributes<
  M extends Model,
  Options extends InferAttributesOptions<keyof M | never | ''> = { omit: never }
  > = InferAttributes<M, Options>;

export type InferEntityCreationAttributes<
  M extends Model,
  Options extends InferAttributesOptions<keyof M | never | ''> = { omit: never }
  > = {
  [Key in keyof M as InternalInferAttributeKeysFromFields<M, Key, Options>]: IsBranded<M[Key], typeof UniqueSymbol> extends true
    ? (M[Key] | undefined)
    : M[Key]
};

export type EntityCreationOptional<T> =
// we don't brand null & undefined as they can't have properties.
// This means `CreationOptional<null>` will not work, but who makes an attribute that only accepts null?
// Note that `CreationOptional<string | null>` does work!
  T extends null | undefined ? T
    : (T & { [UniqueSymbol]?: true });

export type BrandedKeysOf<T, Brand extends symbol> = {
  [P in keyof T]-?: IsBranded<T[P], Brand> extends true ? P : never
}[keyof T];

type InferAttributes<
  M extends Model,
  Options extends InferAttributesOptions<keyof M | never | ''> = { omit: never }
  > = {
  [Key in keyof M as InternalInferAttributeKeysFromFields<M, Key, Options>]: M[Key]
};

type IsBranded<T, Brand extends symbol> = keyof NonNullable<T> extends keyof Omit<NonNullable<T>, Brand>
  ? false
  : true;

export declare const UniqueSymbol: unique symbol;
type InferAttributesOptions<Excluded, > = { omit?: Excluded };

type InternalInferAttributeKeysFromFields<M extends Model, Key extends keyof M, Options extends InferAttributesOptions<keyof M | never | ''>> =
// fields inherited from Model are all excluded
  Key extends keyof Model ? never
    // functions are always excluded
    : M[Key] extends AnyFunction ? never
      // fields branded with NonAttribute are excluded
      : IsBranded<M[Key], typeof UniqueSymbol> extends true ? never
        // check 'omit' option is provided & exclude those listed in it
        : Options['omit'] extends string ? (Key extends Options['omit'] ? never : Key)
          : Key;