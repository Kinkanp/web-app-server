import { HttpRequest, HttpRequestUtil } from '@packages/http-server';
import { CreatePostParams, Post, UpdatePostParams } from '../../../../aggregation/post';
import { Validator } from '../../../../common/validation';
import { UserPublic } from '../../../../aggregation/user';

interface PostService {
  create(params: CreatePostParams): Promise<Post>;
  update(id: number, user: UserPublic, params: UpdatePostParams): Promise<Post>;
  one(id: number, user: UserPublic): Promise<Post>;
  delete(id: number, user: UserPublic): Promise<number>;
  list(authorId: number): Promise<Post[]>;
}

export class PostController {
  constructor(
    private postService: PostService
  ) {
  }

  public list(user: UserPublic): Promise<Post[]> {
    return this.postService.list(user.id);
  }

  public async create(req: HttpRequest, user: UserPublic): Promise<Post> {
    const params = await new HttpRequestUtil(req).getData<{ text: string }>();
    const text = Validator.string(params.text);

    return this.postService.create({ text, authorId: user.id });
  }

  public delete(id: string, user: UserPublic): Promise<number> {
    const postId = Validator.id(id);

    return this.postService.delete(postId, user);
  }

  public one(id: string, user: UserPublic): Promise<Post> {
    const postId = Validator.id(id);

    return this.postService.one(postId, user);
  }

  public async update(req: HttpRequest, id: string, user: UserPublic): Promise<Post> {
    const postId = Validator.id(id);
    const params = await new HttpRequestUtil(req).getData<{ text: string }>();
    const text = Validator.string(params.text);

    return this.postService.update(postId, user, { text });
  }
}
