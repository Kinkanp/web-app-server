import { AppModule } from '@packages/ioc';
import { PostService, PostValidator } from '../../domain/post';
import { PostRepository } from '../../domain/post';
import { DatabaseModule } from '../../common/database';
import { LoggerModule } from '../../common/logger';

export const POST_SERVICE = Symbol('Post service');

export class PostModule extends AppModule<{ [POST_SERVICE]: PostService }> {
  imports = [DatabaseModule, LoggerModule];
  exports = [POST_SERVICE];
  declares = [
    PostRepository,
    PostValidator,
    { map: POST_SERVICE, to: PostService }
  ];
}
