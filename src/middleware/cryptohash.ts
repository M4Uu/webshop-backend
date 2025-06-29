import { scryptSync, randomBytes } from 'crypto';

export class hashCrypto {
  static hashPassword(password: string) {
    const salt = randomBytes(16).toString('hex');
    const hash = scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${hash}`;
  }

  static verifyPassword(password: string, stored: string) {
    const [salt, key] = stored.split(':');
    const hash = scryptSync(password, salt, 64).toString('hex');
    return hash === key;
  }
}