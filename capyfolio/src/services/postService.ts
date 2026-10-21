import type { Post } from '../types';
import postsData from '../data/posts.json';

const STORAGE_KEY = 'capyfolio_posts';

const readPosts = async (): Promise<Post[]> => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    return JSON.parse(raw) as Post[];
  }
  const seeded = postsData as Post[];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
  return seeded;
};

export const postService = {
  async list(): Promise<Post[]> {
    return readPosts();
  },

  async create(post: Post): Promise<Post> {
    const posts = await readPosts();
    posts.unshift(post);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    return post;
  },

  async update(post: Post): Promise<Post> {
    const posts = await readPosts();
    const index = posts.findIndex((entry) => entry.id === post.id);
    if (index === -1) return post;
    posts[index] = post;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    return post;
  },

  async replaceAll(posts: Post[]): Promise<Post[]> {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    return posts;
  },
};
