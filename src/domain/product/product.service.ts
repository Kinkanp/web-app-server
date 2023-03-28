import { inject, injectable } from 'inversify';
import { Product } from './product.entity';
import { ProductRepository } from './product.repository';
import { NotFoundError } from '../../common/errors';

@injectable()
export class ProductService {
  constructor(
    @inject(ProductRepository) private productRepository: ProductRepository
  ) {
  }

  public async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne(id);

    if (!product) {
      throw new NotFoundError(`product with id '${id}' doesn't exist`);
    }

    return product;
  }
}
