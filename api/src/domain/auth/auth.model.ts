import { UserPublic, User } from '../../aggregation/user';

export interface Session {
  userId: number;
  refreshToken: string;
}

export interface LoginParams {
  username: string;
  password: string;
}

export interface RegisterParams {
  username: string;
  password: string;
}

export interface AuthServiceHelper {
  findUserByUsername(username: string): Promise<User | null>;
  findUserById(username: number): Promise<UserPublic | null>;
  createUser(params: RegisterParams): Promise<UserPublic>;
}

export type LoginResponse = { user: UserPublic } & AccessTokensResponse;

export interface AccessTokensResponse {
  refreshToken: string;
  accessToken: string;
}
