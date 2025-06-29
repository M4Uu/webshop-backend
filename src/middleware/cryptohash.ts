import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

export class cryptoHash {
  async createHash(password: string): Promise<string> {
    const salt = randomBytes(16).toString('hex');
    const hashBuffer = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${salt}:${hashBuffer.toString('hex')}`;
  }

  async verifyHash(password: string, storedHash: string): Promise<boolean> {
    const [salt, originalHash] = storedHash.split(':');
    const hashBuffer = (await scryptAsync(password, salt, 64)) as Buffer;
    return timingSafeEqual(
      Buffer.from(originalHash, 'hex'),
      hashBuffer
    );
  }
}