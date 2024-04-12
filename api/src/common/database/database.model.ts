import { PrismaClient, Prisma } from '@prisma/client';

export type DBConnection = PrismaClient;

export function isDatabaseError(error: Error): boolean {
  const dbErrors = [
    Prisma.PrismaClientKnownRequestError,
    Prisma.PrismaClientUnknownRequestError,
    Prisma.PrismaClientRustPanicError,
    Prisma.PrismaClientInitializationError,
    Prisma.PrismaClientValidationError
  ];

  return dbErrors.some(errorType => error instanceof errorType);
}
