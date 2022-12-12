export interface User {
  id: number;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPublic extends Omit<User, 'password'> {
  password?: never;
}
