import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';

export class cryptoHash {

  createHash(password: string): string {
    const salt = randomBytes(16).toString('hex');
    const hash = scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${hash}`;
  }

  verifyHash(password: string, storedHash: string): boolean {
    const [salt, originalHash] = storedHash.split(':');
    const hashBuffer = scryptSync(password, salt, 64);
    return timingSafeEqual(
      Buffer.from(originalHash, 'hex'),
      hashBuffer
    );
  }
}