import { inject, injectable } from 'inversify';
import { Post } from './post.entity';
import { PostRepository } from './post.repository';
import { CreatePostParams, UpdatePostParams } from './post.models';
import { PostValidator } from './post-validator';
import { ILogger, LOGGER } from '../../common/logger';
import { ForbiddenError, NotFoundError } from '../../common/errors';
import { UserPublic } from '../../aggregation/user';

@injectable()
export class PostService {
  constructor(
    @inject(PostRepository) private postRepository: PostRepository,
    @inject(PostValidator) private postValidator: PostValidator,
    @inject(LOGGER) private logger: ILogger,
  ) {
  }

  public async create(params: CreatePostParams): Promise<Post> {
    this.postValidator.validateCreate(params);

    const post = await this.postRepository.create(params);

    this.logger.info('Post', `create: ${post.id}`);

    return post;
  }

  public async update(id: number, user: UserPublic, params: UpdatePostParams): Promise<Post> {
    await this.findOneOrThrow(id, user);
    this.postValidator.validateUpdate(params);

    const post = await this.postRepository.update(id, params);

    this.logger.info('Post', `update: ${post.id}`);

    return post;
  }

  public async delete(id: number, user: UserPublic): Promise<number> {
    await this.findOneOrThrow(id, user);
    await this.postRepository.delete(id);

    this.logger.info('Post', `delete: ${id}`);

    return id;
  }

  public async list(authorId: number): Promise<Post[]> {
    const posts = await this.postRepository.list(authorId)

    this.logger.info('Post', `list: ${posts.length}`);

    return posts;
  }

  public async one(id: number, user: UserPublic): Promise<Post> {
    return this.findOneOrThrow(id, user);
  }

  private async findOneOrThrow(id: number, user: UserPublic): Promise<Post> {
    const post = await this.postRepository.one(id);

    if (!post) {
      throw new NotFoundError(`post with id '${id}' doesn't exist`);
    }

    if (user.id !== post.authorId) {
      throw new ForbiddenError();
    }

    return post;
  }
}
