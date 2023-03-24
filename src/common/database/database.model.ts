import { PrismaClient } from '@prisma/client';
import {
  PrismaClientKnownRequestError,
  PrismaClientInitializationError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientValidationError
} from '@prisma/client/runtime/library';

export type DBConnection = PrismaClient;

export function isDatabaseError(error: Error): boolean {
  const dbErrors = [
    PrismaClientKnownRequestError,
    PrismaClientUnknownRequestError,
    PrismaClientRustPanicError,
    PrismaClientInitializationError,
    PrismaClientValidationError
  ];

  return dbErrors.some(errorType => error instanceof errorType);
}
