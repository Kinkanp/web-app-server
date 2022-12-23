import { inject, injectable } from 'inversify';
import { DB_CONNECTION, DBConnection } from '../../common/database';
import { Post } from './post.entity';
import { CreatePostParams, UpdatePostParams } from './post.models';

@injectable()
export class PostRepository {
  constructor(@inject(DB_CONNECTION) private connection: DBConnection) {
  }

  public create(data: CreatePostParams): Promise<Post> {
    return this.connection.postModel.create({ data })
  }

  public delete(postId: number): Promise<number> {
    return this.connection.postModel.delete({
      where: { id: postId }
    }).then(() => postId);
  }

  public update(id: number, data: UpdatePostParams): Promise<Post> {
    return this.connection.postModel.update({
      where: { id },
      data: { text: data.text }
    })
  }

  public list(authorId: number): Promise<Post[]> {
    return this.connection.postModel.findMany({
      where: { authorId },
      orderBy: {
        updatedAt: 'desc'
      }
    });
  }

  public one(id: number): Promise<Post | null> {
    return this.connection.postModel.findUnique({ where: { id } });
  }
}
