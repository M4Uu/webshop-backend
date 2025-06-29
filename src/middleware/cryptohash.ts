import { pbkdf2Sync, randomBytes, timingSafeEqual } from 'crypto';

export class cryptoHash {
  private ITERATIONS = 100000;
  private KEY_LENGTH = 64;
  private DIGEST = 'sha512';

  createHash(password: string): string {
    // 1. Generar salt aleatorio
    const salt = randomBytes(16).toString('hex');

    // 2. Derivar clave usando PBKDF2
    const hash = pbkdf2Sync(
      password,
      salt,
      this.ITERATIONS,
      this.KEY_LENGTH,
      this.DIGEST
    ).toString('hex');

    // 3. Devolver formato: salt:iteraciones:hash
    return `${salt}:${this.ITERATIONS}:${hash}`;
  }


  verifyHash(password: string, storedHash: string): boolean {
    try {
      // 1. Dividir el hash almacenado en sus componentes
      const [salt, iterationsStr, originalHash] = storedHash.split(':');
      const iterations = parseInt(iterationsStr, 10);

      // 2. Generar hash con la misma sal y parámetros
      const newHash = pbkdf2Sync(
        password,
        salt,
        iterations,
        this.KEY_LENGTH,
        this.DIGEST
      );

      // 3. Comparación segura contra ataques de timing
      return timingSafeEqual(
        Buffer.from(originalHash, 'hex'),
        newHash
      );
    } catch {
      return false;
    }
  }
}