import { Post } from '../src/domain/post';
import { PrismaClient, UserModel } from '@prisma/client';
import { getRandomNumber } from './utils';

export type PostsSeed = Array<PostsByUser>;

interface PostsByUser {
  user: UserModel;
  posts: Post[];
}

export async function getPostsSeed(
  connection: PrismaClient,
  users: UserModel[]
): Promise<PostsSeed> {
  const postsByUsers: PostsSeed = [];
  const postOwners = users.splice(0, 2);
  const postsToCreate = 3;

  for (let i = 0; i < postOwners.length; i++) {
    const user = postOwners[i];
    postsByUsers[i] = { user, posts: [] };

    for (let j = 0; j < postsToCreate; j++) {
      const text = `post description text: ${getRandomNumber()}`;
      const post = await create(connection, user.id, text);

      postsByUsers[i].posts.push(post);
    }
  }

  return postsByUsers;
}

function create(
  connection: PrismaClient,
  userId: number,
  text: string
): Promise<Post> {
  return connection.postModel.create({
    data: { authorId: userId, text }
  });
}
