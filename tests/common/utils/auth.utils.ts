import { config } from 'dotenv'
import * as jwt from 'jsonwebtoken';
import { SignOptions } from 'jsonwebtoken';
config();

export function createAccessToken(userId: number, options?: SignOptions): string {
  const secret = process.env.JWT_SECRET as string;

  return jwt.sign({ userId }, secret, options);
}
