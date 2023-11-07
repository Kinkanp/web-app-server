import { AppModule } from '@packages/ioc';
import { UserController } from './user.controller';
import { AppController, AppRoutes } from '../http.constants';
import { AuthGuardModule } from '../guards';
import { UserModule } from '../../../aggregation/user';
import { AuthController } from './auth.controller';
import { PostController } from './post.controller';
import { AuthModule } from '../../../aggregation/auth';
import { PostModule } from '../../../aggregation/post';
import { HealthController } from './health.controller';

export class ControllersModule extends AppModule {
  controllers = [
    AuthController,
    UserController,
    PostController,
    HealthController
  ];

  imports = [
    UserModule,
    AuthModule,
    PostModule,
    AuthGuardModule,
  ];
  declares = [...this.controllers];

  getRoutes(): AppRoutes {
    return this.controllers
      .map(controller => this.inject<AppController>(controller).getRoutes())
      .flat();
  }
}
