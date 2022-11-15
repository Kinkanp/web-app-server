import { User, CreateUserParams } from 'aggregation/users';

export interface UserServiceModel {
  list(): Promise<User[]>;
  create(params: CreateUserParams): Promise<User>;
  findOne(id: number): Promise<User>;
}
