import { HttpRequest, HttpRequestUtil } from '@packages/http-server';
import { CreatePostParams, Post } from '../../../../aggregation/post';
import { Validator } from '../../../../common/validation';
import { UserPublic } from '../../../../aggregation/user';

interface PostService {
  create(params: CreatePostParams): Promise<Post>;
  list(): Promise<Post[]>;
}

export class PostController {
  constructor(
    private postService: PostService
  ) {
  }

  public list(): Promise<Post[]> {
    return this.postService.list();
  }

  public async create(req: HttpRequest, user: UserPublic): Promise<Post> {
    const params = await new HttpRequestUtil(req).getData();
    const { text } = Validator.requiredObject<{ text: string }>(params, {
      text: { type: 'string' }
    });

    return this.postService.create({ text, authorId: user.id });
  }
}
