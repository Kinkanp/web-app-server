import { AppModule } from '@packages/ioc';
import { PostService } from '../../domain/post';
import { PostRepository } from '../../domain/post';
import { DatabaseModule } from '../../common/database';
import { LoggerModule } from '../../common/logger';

export const POST_SERVICE = Symbol('Post service');

export class PostModule extends AppModule<{ [POST_SERVICE]: PostService }> {
  public imports = [DatabaseModule, LoggerModule];
  public exports = [POST_SERVICE];
  public declares = [
    PostRepository,
    { map: POST_SERVICE, to: PostService }
  ];
}
