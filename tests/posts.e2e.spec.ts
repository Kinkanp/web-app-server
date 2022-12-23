import { describe, expect, test } from 'vitest';
import { createEndpoint, expectErrorResponse, expectValidDate, extractData, getHttpServer } from './common';
import { LocalTestContext } from './common/types';
import request from 'supertest';
import { createAccessToken } from './common/utils/auth.utils';
import { Post } from '../src/domain/post';

describe('posts', () => {
  const server = getHttpServer();

  describe('get list', () => {
    test<LocalTestContext>('should return a list of postsWithUsers', ({ seeds }) => {
      const { user } = seeds.postsWithUsers[0];
      const token = createAccessToken(user.id);

      return request(server)
        .get(createEndpoint('posts'))
        .auth(token, { type: 'bearer' })
        .expect(200)
        .expect(res => {
          const posts = extractData<Post[]>(res.body);

          posts.forEach(post => expect(post).toStrictEqual({
            id: expect.any(Number),
            createdAt: expectValidDate(post.createdAt),
            updatedAt: expectValidDate(post.updatedAt),
            text: expect.any(String),
            authorId: expect.any(Number)
          }));
        })
    });

    test<LocalTestContext>('should return postsWithUsers that belong to current user', ({ seeds }) => {
      const { user } = seeds.postsWithUsers[0];
      const token = createAccessToken(user.id);

      return request(server)
        .get(createEndpoint('posts'))
        .auth(token, { type: 'bearer' })
        .expect(200)
        .expect(res => {
          const posts = extractData<Post[]>(res.body);

          posts.forEach(post => expect(post.authorId).toEqual(user.id));
        });
    });

    test('should throw if user is unauthorized', () => {
      return request(server)
        .get(createEndpoint('posts'))
        .expect(res => expectErrorResponse(res, 401));
    });
  });

  describe('get one', () => {
    test<LocalTestContext>('should return a post', ({ seeds }) => {
      const { user, posts } = seeds.postsWithUsers[0];
      const [post] = posts;
      const token = createAccessToken(user.id);

      return request(server)
        .get(createEndpoint(`posts/${post.id}`))
        .auth(token, { type: 'bearer' })
        .expect(200)
        .expect(res => {
          const postResponse = extractData<Post>(res.body);

          expect(postResponse).toStrictEqual({
            ...post,
            createdAt: post.createdAt.toISOString(),
            updatedAt: post.updatedAt.toISOString(),
          });
        });
    });

    test<LocalTestContext>('should throw if post belongs to other user', ({ seeds }) => {
      const firstUserPostId = seeds.postsWithUsers[0].posts[0].id;
      const { user: secondUser } = seeds.postsWithUsers[1];
      const secondUserToken = createAccessToken(secondUser.id);

      return request(server)
        .get(createEndpoint(`posts/${firstUserPostId}`))
        .auth(secondUserToken, { type: 'bearer' })
        .expect(res => expectErrorResponse(res, 403));
    });

    test<LocalTestContext>('should throw if post does not exist', ({ seeds }) => {
      const { user } = seeds.postsWithUsers[0];
      const token = createAccessToken(user.id);

      return request(server)
        .get(createEndpoint('posts/999999'))
        .auth(token, { type: 'bearer' })
        .expect(res => expectErrorResponse(res, 404));
    });

    test<LocalTestContext>('should throw if user is unauthorized', ({ seeds }) => {
      const { posts } = seeds.postsWithUsers[0];
      const postId = posts[0].id;

      return request(server)
        .get(createEndpoint(`posts/${postId}`))
        .expect(res => expectErrorResponse(res, 401));
    });
  });

  describe('create', () => {
    test<LocalTestContext>('should create a post', async ({ seeds }) => {
      const [user] = seeds.users;
      const token = createAccessToken(user.id);
      const text = 'new post description!';

      const createPostResponse = await request(server)
        .post(createEndpoint('posts'))
        .auth(token, { type: 'bearer' })
        .send({ text })
        .expect(200)
        .expect(res => {
          const post = extractData<Post>(res.body);

          expect(post).toStrictEqual({
            id: expect.any(Number),
            createdAt: expectValidDate(post.createdAt),
            updatedAt: expectValidDate(post.updatedAt),
            text,
            authorId: user.id
          });

          return post;
        });

      const createdPost = extractData<Post>(createPostResponse.body);

      return request(server)
        .get(createEndpoint(`posts/${createdPost.id}`))
        .auth(token, { type: 'bearer' })
        .expect(200)
        .expect(res => {
          const postResponse = extractData<Post>(res.body);

          expect(postResponse).toStrictEqual(createdPost);
        });
    });

    test<LocalTestContext>('should validate post params', async ({ seeds }) => {
      const [user] = seeds.users;
      const token = createAccessToken(user.id);

      return request(server)
        .post(createEndpoint('posts'))
        .auth(token, { type: 'bearer' })
        .send({ text: '' })
        .expect(res => expectErrorResponse(res, 400));
    });

    test('should throw if user is unauthorized', () => {
      return request(server)
        .post(createEndpoint('posts'))
        .send({ text: 'new post description!' })
        .expect(res => expectErrorResponse(res, 401));
    });
  });

  describe('update', () => {
    test<LocalTestContext>('should update a post', ({ seeds }) => {
      const { user, posts } = seeds.postsWithUsers[0];
      const [postToEdit] = posts;
      const token = createAccessToken(user.id);
      const newText = postToEdit.text + '__UPDATED';

      return request(server)
        .patch(createEndpoint(`posts/${postToEdit.id}`))
        .auth(token, { type: 'bearer' })
        .send({ text: newText })
        .expect(200)
        .expect(res => {
          const post = extractData<Post>(res.body);

          expect(post).toStrictEqual({
            id: postToEdit.id,
            createdAt: postToEdit.createdAt.toISOString(),
            updatedAt: expectValidDate(post.updatedAt),
            text: newText,
            authorId: user.id
          })
        });
    });

    test<LocalTestContext>('should validate post params', ({ seeds }) => {
      const { user, posts } = seeds.postsWithUsers[0];
      const [postToEdit] = posts;
      const token = createAccessToken(user.id);

      return request(server)
        .patch(createEndpoint(`posts/${postToEdit.id}`))
        .auth(token, { type: 'bearer' })
        .send({ text: '' })
        .expect(res => expectErrorResponse(res, 400));
    });

    test<LocalTestContext>('should throw if post belongs to other user', ({ seeds }) => {
      const firstUserPost = seeds.postsWithUsers[0].posts[0];
      const secondUser = seeds.postsWithUsers[1].user;
      const secondUserToken = createAccessToken(secondUser.id);

      return request(server)
        .patch(createEndpoint(`posts/${firstUserPost.id}`))
        .auth(secondUserToken, { type: 'bearer' })
        .send({ text: firstUserPost.text })
        .expect(res => expectErrorResponse(res, 403));
    });

    test<LocalTestContext>('should throw if post does not exist', ({ seeds }) => {
      const { user } = seeds.postsWithUsers[0];
      const token = createAccessToken(user.id);

      return request(server)
        .patch(createEndpoint('posts/999999'))
        .auth(token, { type: 'bearer' })
        .send({ text: 'post some text description' })
        .expect(res => expectErrorResponse(res, 404));
    });

    test<LocalTestContext>('should throw if user is unauthorized', ({ seeds }) => {
      const postsId = seeds.postsWithUsers[0].posts[0].id;

      return request(server)
        .patch(createEndpoint(`posts/${postsId}`))
        .send({ text: 'post some text description' })
        .expect(res => expectErrorResponse(res, 401));
    });
  });

  describe('delete', () => {
    test<LocalTestContext>('should delete a post', async ({ seeds }) => {
      const { user, posts } = seeds.postsWithUsers[0];
      const [postToDelete] = posts;
      const token = createAccessToken(user.id);

      await request(server)
        .delete(createEndpoint(`posts/${postToDelete.id}`))
        .auth(token, { type: 'bearer' })
        .expect(200);

      return request(server)
        .get(createEndpoint(`posts/${postToDelete.id}`))
        .auth(token, { type: 'bearer' })
        .expect(res => expectErrorResponse(res, 404));
    });

    test<LocalTestContext>('should throw if post belongs to other user', ({ seeds }) => {
      const firstUserPost = seeds.postsWithUsers[0].posts[1];
      const secondUser = seeds.postsWithUsers[1].user;
      const secondUserToken = createAccessToken(secondUser.id);

      return request(server)
        .delete(createEndpoint(`posts/${firstUserPost.id}`))
        .auth(secondUserToken, { type: 'bearer' })
        .expect(res => expectErrorResponse(res, 403));
    });

    test<LocalTestContext>('should throw if post does not exist', ({ seeds }) => {
      const { user } = seeds.postsWithUsers[0];
      const token = createAccessToken(user.id);

      return request(server)
        .delete(createEndpoint('posts/999999'))
        .auth(token, { type: 'bearer' })
        .expect(res => expectErrorResponse(res, 404));
    });

    test<LocalTestContext>('should throw if user is unauthorized', ({ seeds }) => {
      const postsId = seeds.postsWithUsers[0].posts[0].id;

      return request(server)
        .delete(createEndpoint(`posts/${postsId}`))
        .send({ text: 'post some text description' })
        .expect(res => expectErrorResponse(res, 401));
    });
  });
});
