import { DatabaseModule } from '../../common/database';
import { LoggerModule } from '../../common/logger';
import { ProductRepository } from '../../domain/product/product.repository';
import { ProductService } from '../../domain/product/product.service';
import { AppModule } from '@packages/ioc';

export const PRODUCT_SERVICE = Symbol('Product service');

export class ProductModule extends AppModule<{ [PRODUCT_SERVICE]: ProductService }>  {
  public imports = [DatabaseModule, LoggerModule];
  public exports = [PRODUCT_SERVICE];
  public declares = [
    ProductRepository,
    { map: PRODUCT_SERVICE, to: ProductService }
  ];
}
