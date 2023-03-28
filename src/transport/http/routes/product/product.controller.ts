import { Product } from '../../../../aggregation/product';
import { Validator } from '../../../../common/validation';

interface ProductService {
  findOne(id: number): Promise<Product>;
}

export class ProductController {
  constructor(private productService: ProductService) {
  }

  public findOne(id: string): Promise<Product> {
    const productId = Validator.id(id);

    return this.productService.findOne(productId);
  }
}
