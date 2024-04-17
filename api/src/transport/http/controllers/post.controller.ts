import { HttpRequest, HttpRequestUtil } from '@packages/http-server';
import { CreatePostParams, Post, POST_SERVICE, UpdatePostParams } from '../../../aggregation/post';
import { Validator } from '../../../common/validation';
import { UserPublic } from '../../../aggregation/user';
import { AppController, AppRoutes } from '../http.constants';
import { inject, injectable } from 'inversify';
import { AUTH_GUARD } from '../guards';
import { AuthGuard } from '../guards/auth/auth.guard';

interface PostService {
  create(params: CreatePostParams): Promise<Post>;
  update(id: number, user: UserPublic, params: UpdatePostParams): Promise<Post>;
  one(id: number, user: UserPublic): Promise<Post>;
  delete(id: number, user: UserPublic): Promise<number>;
  list(authorId: number): Promise<Post[]>;
}

@injectable()
export class PostController implements AppController {
  constructor(
    @inject(AUTH_GUARD) private authGuard: AuthGuard,
    @inject(POST_SERVICE) private postService: PostService
  ) {}

  public getRoutes(): AppRoutes {
    return [
      {
        path: 'posts',
        guards: [this.authGuard],
        children: [
          {
            path: '',
            method: 'GET',
            handler: ({ context }) => this.list(context.get('user'))
          },
          {
            path: '',
            method: 'POST',
            handler: ({ req, context }) => this.create(req, context.get('user'))
          },
          {
            path: ':id',
            method: 'PATCH',
            handler: ({ req, params, context }) => this.update(req, params[0], context.get('user'))
          },
          {
            path: ':id',
            method: 'GET',
            handler: ({ params, context }) => this.one(params[0], context.get('user'))
          },
          {
            path: ':id',
            method: 'DELETE',
            handler: ({ params, context }) => this.delete(params[0], context.get('user'))
          }
        ]
      },
    ]
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
