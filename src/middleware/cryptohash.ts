import { createHash, randomBytes } from 'crypto';

export class cryptoHash {
  /**
   * Crea un hash seguro para almacenamiento
   * @param password Contraseña en texto plano
   * @returns Hash en formato string (sal:iteraciones:hash)
   */
  async createHash(password: string): Promise<string> {
    // 1. Generar sal única (16 bytes)
    const salt = randomBytes(16).toString('hex');

    // 2. Configurar iteraciones (adaptativo a entorno)
    const iterations = process.env['NODE_ENV'] === 'production' ? 5000 : 10000;

    // 3. Derivación de clave
    const hash = cryptoHash.deriveKey(password, salt, iterations);

    return `${salt}:${iterations}:${hash}`;
  }

  /**
   * Verifica una contraseña contra un hash almacenado
   * @param password Contraseña a verificar
   * @param storedHash Hash almacenado (sal:iteraciones:hash)
   */
  async verifyHash(password: string, storedHash: string): Promise<boolean> {
    const [salt, iterationsStr, originalHash] = storedHash.split(':');
    const iterations = parseInt(iterationsStr, 10);

    const testHash = cryptoHash.deriveKey(password, salt, iterations);
    return testHash === originalHash;
  }

  /**
   * Función de derivación de clave (KDF)
   * @param password Contraseña
   * @param salt Sal única
   * @param iterations Iteraciones
   * @returns Hash hexadecimal
   */
  private static deriveKey(password: string, salt: string, iterations: number): string {
    let intermediate = password + salt;

    // Capa 1: Hash inicial
    let hashBuffer = createHash('sha256')
      .update(intermediate)
      .digest();

    // Capa 2: Iteraciones con realimentación
    for (let i = 0; i < iterations; i++) {
      const hasher = createHash('sha256');
      hasher.update(Buffer.concat([
        hashBuffer,
        Buffer.from(i % 2 === 0 ? password : salt, 'utf-8')
      ]));
      hashBuffer = hasher.digest();
    }

    // Capa 3: Transformación final
    return createHash('sha512')
      .update(hashBuffer)
      .digest('hex');
  }
}