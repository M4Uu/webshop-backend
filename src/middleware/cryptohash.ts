import { pbkdf2Sync, randomBytes, timingSafeEqual } from 'crypto';

export class LocalCryptoHasher {
  // Parámetros de seguridad del hash (puedes ajustarlos si es necesario, pero estos son buenos puntos de partida)
  #ITERATIONS = 100000; // Número de iteraciones (más alto = más seguro, más lento)
  #KEY_LENGTH = 64;    // Longitud de la clave derivada en bytes
  #DIGEST = 'sha512';  // Algoritmo de hash (SHA-512 es una buena elección)

  /**
   * Genera un hash de la contraseña usando PBKDF2 y un salt aleatorio.
   * El formato del hash resultante es "salt:iteraciones:hash".
   *
   * @param {string} password La contraseña en texto plano a hashear.
   * @returns {string | null} El hash de la contraseña o null si ocurre un error.
   */
  createHash(password: any) {
    // Validar la entrada de la contraseña
    if (typeof password !== 'string' || password.length === 0) {
      console.error("[LocalCryptoHasher ERROR]: La contraseña proporcionada es inválida (no es string o está vacía).");
      return null;
    }

    try {
      // 1. Generar un salt criptográficamente seguro de 16 bytes (32 caracteres hexadecimales)
      const salt = randomBytes(16).toString('hex');

      // 2. Derivar la clave (hash) usando PBKDF2 de forma síncrona
      const hashBuffer = pbkdf2Sync(
        password,
        salt,
        this.#ITERATIONS,
        this.#KEY_LENGTH,
        this.#DIGEST
      );
      const hash = hashBuffer.toString('hex');

      // 3. Devolver el hash en un formato que incluya el salt y las iteraciones
      return `${salt}:${this.#ITERATIONS}:${hash}`;

    } catch (error) {
      console.error("[LocalCryptoHasher FATAL ERROR]: Fallo al crear el hash:", error);
      // Si necesitas ver el stack completo, descomenta la línea de abajo:
      // console.error(error.stack);
      return null;
    }
  }

  /**
   * Verifica si una contraseña en texto plano coincide con un hash almacenado.
   *
   * @param {string} password La contraseña en texto plano a verificar.
   * @param {string} storedHash El hash almacenado (en formato "salt:iteraciones:hash").
   * @returns {boolean} True si la contraseña coincide, false en caso contrario o si hay un error.
   */
  verifyHash(password: any, storedHash: any) {
    // Validar las entradas
    if (typeof password !== 'string' || password.length === 0 ||
      typeof storedHash !== 'string' || storedHash.length === 0) {
      console.warn("[LocalCryptoHasher WARNING]: Entrada inválida para la verificación del hash.");
      return false;
    }

    try {
      // 1. Separar el hash almacenado en sus componentes
      const parts = storedHash.split(':');
      if (parts.length !== 3) {
        console.error("[LocalCryptoHasher ERROR]: Formato de hash almacenado inválido. Se esperaba 'salt:iteraciones:hash'.");
        return false;
      }
      const [salt, iterationsStr, originalHash] = parts;
      const iterations = parseInt(iterationsStr, 10);

      // Validaciones adicionales para asegurar que los componentes son válidos
      if (isNaN(iterations) || iterations <= 0) {
        console.error("[LocalCryptoHasher ERROR]: Número de iteraciones inválido en el hash almacenado.");
        return false;
      }
      if (!salt || !originalHash) {
        console.error("[LocalCryptoHasher ERROR]: Salt u hash original nulos/vacíos en el hash almacenado.");
        return false;
      }


      // 2. Generar un nuevo hash con la misma contraseña y los parámetros del hash almacenado
      const newHashBuffer = pbkdf2Sync(
        password,
        salt,
        iterations, // Usar las iteraciones del hash almacenado
        this.#KEY_LENGTH,
        this.#DIGEST
      );

      // 3. Comparar de forma segura contra ataques de temporización (timing attacks)
      // Asegúrate de que ambos buffers tengan la misma longitud antes de comparar
      const originalHashBuffer = Buffer.from(originalHash, 'hex');
      if (originalHashBuffer.length !== newHashBuffer.length) {
        console.warn("[LocalCryptoHasher WARNING]: Las longitudes de los hashes no coinciden. Posible manipulación o error.");
        return false;
      }

      return timingSafeEqual(originalHashBuffer, newHashBuffer);

    } catch (error) {
      console.error("[LocalCryptoHasher FATAL ERROR]: Fallo al verificar el hash:", error);
      // console.error(error.stack);
      return false;
    }
  }
}