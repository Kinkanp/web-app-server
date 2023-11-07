import { HttpRequest } from '../server';

export function getIpAddressFromRequest(req: HttpRequest): string {
  return (req.headers['x-real-ip'] || req.socket.remoteAddress) as string;
}
