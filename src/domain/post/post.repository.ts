import { inject, injectable } from 'inversify';
import { DB_CONNECTION, DBConnection } from '../../common/database';
import { Post } from './post.entity';
import { CreatePostParams } from './post.models';

@injectable()
export class PostRepository {
  constructor(@inject(DB_CONNECTION) private connection: DBConnection) {
  }

  public create(data: CreatePostParams): Promise<Post> {
    return this.connection.postModel.create({ data })
  }

  public list(): Promise<Post[]> {
    return this.connection.postModel.findMany();
  }
}
