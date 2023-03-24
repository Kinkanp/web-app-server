import { inject, injectable } from 'inversify';
import { DB_CONNECTION, DBConnection } from '../../common/database';
import { Product } from './product.entity';

@injectable()
export class ProductRepository {
  constructor(@inject(DB_CONNECTION) private connection: DBConnection) {}

  public findOne(id: number): Promise<Product | null> {
    return this.connection.productModel.findUnique({
      where: { id },
      include: {
        features: {
          select: {
            feature: {
              select: {
                name: true,
                id: true,
                values: {
                  select: {
                    id: true,
                    title: true
                  }
                }
              },
            }
          }
        }
      }
    }).then(product => {
      if (!product) {
        return product;
      }

      return {
        ...product,
        features: product?.features?.map(feature => feature.feature)
      } as Product;
    });
  }
}
