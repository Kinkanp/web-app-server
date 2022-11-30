import { UserModel } from '@prisma/client';
import { getRandomNumber } from './utils';

export function getUsersSeed(quantity: number): Omit<UserModel, 'id'>[] {
  return Array.from({ length: quantity })
    .map(() => {
      const index = getRandomNumber();
      return {
        firstName: `Firstname-${index}`,
        lastName: `Lastname-${index}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    })
}