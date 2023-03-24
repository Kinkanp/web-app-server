import { AppRoutes } from '../../http.constants';
import { ProductController } from './product.controller';
import { injectModule } from '@packages/ioc';
import { PRODUCT_SERVICE, ProductModule } from '../../../../aggregation/product';

export function getProductRoutes(): AppRoutes {
  const service = injectModule(ProductModule).import(PRODUCT_SERVICE);
  const controller = new ProductController(service);

  return [
    {
      path: '/products/:id',
      method: 'GET',
      handler: ({ params }) => controller.findOne(params[0])
    },
  ]
}
