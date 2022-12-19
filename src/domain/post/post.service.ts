import { inject, injectable } from 'inversify';
import { Post } from './post.entity';
import { PostRepository } from './post.repository';
import { CreatePostParams } from './post.models';

@injectable()
export class PostService {
  constructor(
    @inject(PostRepository) private postRepository: PostRepository
  ) {
  }

  public create(params: CreatePostParams): Promise<Post> {
    return this.postRepository.create(params);
  }

  public list(): Promise<Post[]> {
    return this.postRepository.list();
  }
}
