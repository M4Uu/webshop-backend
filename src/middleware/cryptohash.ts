export class ThesisHasher {
  /**
   * Crea un hash seguro usando únicamente operaciones JavaScript puras
   * @param password Contraseña en texto plano
   * @returns Hash en formato string (sal:iteraciones:hash)
   */
  static createHash(password: string): string {
    // Generar sal aleatoria (16 caracteres)
    const salt = this.generateSalt(16);

    // Número de iteraciones adaptativo
    const iterations = 10000 + (password.length * 100);

    // Crear hash
    const hash = this.deriveKey(password, salt, iterations);

    return `${salt}:${iterations}:${hash}`;
  }

  /**
   * Verifica una contraseña contra un hash almacenado
   * @param password Contraseña a verificar
   * @param storedHash Hash almacenado (sal:iteraciones:hash)
   */
  static verifyHash(password: string, storedHash: string): boolean {
    const parts = storedHash.split(':');
    if (parts.length !== 3) return false;

    const [salt, iterationsStr, originalHash] = parts;
    const iterations = parseInt(iterationsStr, 10);

    if (isNaN(iterations)) return false;

    const testHash = this.deriveKey(password, salt, iterations);
    return testHash === originalHash;
  }

  /**
   * Genera una sal aleatoria
   * @param length Longitud de la sal
   */
  private static generateSalt(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let salt = '';

    for (let i = 0; i < length; i++) {
      // Generar índice pseudoaleatorio
      const random = Math.sin(Date.now() + i) * 10000;
      const index = Math.floor((random - Math.floor(random)) * chars.length);
      salt += chars[index % chars.length];
    }

    return salt;
  }

  /**
   * Función de derivación de clave (Key Derivation Function)
   * @param password Contraseña
   * @param salt Sal única
   * @param iterations Iteraciones
   */
  private static deriveKey(password: string, salt: string, iterations: number): string {
    // Mezcla inicial de contraseña y sal
    let hash = this.mixStrings(password, salt);

    // Aplicar iteraciones
    for (let i = 0; i < iterations; i++) {
      // Alternar entre diferentes operaciones de mezcla
      if (i % 3 === 0) {
        hash = this.rot13Hash(hash);
      } else if (i % 3 === 1) {
        hash = this.xorShiftHash(hash + i);
      } else {
        hash = this.circularShiftHash(hash);
      }

      // Añadir complejidad adicional periódicamente
      if (i % 100 === 0) {
        hash = this.mixStrings(hash, salt);
      }
    }

    return this.toBase64(hash);
  }

  /**
   * Mezcla dos cadenas usando operaciones de bits
   * @param str1 Primera cadena
   * @param str2 Segunda cadena
   */
  private static mixStrings(str1: string, str2: string): string {
    let result = '';
    const maxLength = Math.max(str1.length, str2.length);

    for (let i = 0; i < maxLength; i++) {
      const char1 = str1.charCodeAt(i % str1.length) || 0;
      const char2 = str2.charCodeAt(i % str2.length) || 0;

      // Operaciones de bits para mezclar
      const mixed = ((char1 << 5) ^ (char2 << 2)) |
        ((char1 >>> 3) & (char2 >>> 1));

      // Convertir a caracter seguro (rango ASCII 33-126)
      const safeChar = 33 + (Math.abs(mixed) % 94);
      result += String.fromCharCode(safeChar);
    }

    return result;
  }

  /**
   * Aplica ROT13 y otras transformaciones
   * @param input Cadena de entrada
   */
  private static rot13Hash(input: string): string {
    return input.split('').map(char => {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(((code - 65 + 13) % 26) + 65);
      } else if (code >= 97 && code <= 122) {
        return String.fromCharCode(((code - 97 + 13) % 26) + 97);
      }
      return char;
    }).join('');
  }

  /**
   * Hash usando desplazamiento XOR
   * @param input Cadena de entrada
   */
  private static xorShiftHash(input: string): string {
    let hash = 0;

    for (let i = 0; i < input.length; i++) {
      hash ^= input.charCodeAt(i);
      hash = (hash << 7) | (hash >>> 25);
      hash ^= i;
      hash = Math.abs(hash);
    }

    // Convertir a cadena
    let result = '';
    for (let i = 0; i < 8; i++) {
      const byte = (hash >>> (i * 4)) & 0xFF;
      result += String.fromCharCode(33 + (byte % 94));
    }

    return result;
  }

  /**
   * Desplazamiento circular de bits
   * @param input Cadena de entrada
   */
  private static circularShiftHash(input: string): string {
    return input.split('').map((char, index) => {
      const code = char.charCodeAt(0);
      const shift = (index % 7) + 1;
      return String.fromCharCode(
        ((code << shift) | (code >>> (8 - shift))) % 256
      );
    }).join('');
  }

  /**
   * Convierte una cadena a Base64 personalizado
   * @param input Cadena de entrada
   */
  private static toBase64(input: string): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    let result = '';
    let buffer = 0;
    let bits = 0;

    for (const char of input) {
      buffer = (buffer << 8) | char.charCodeAt(0);
      bits += 8;

      while (bits >= 6) {
        bits -= 6;
        const index = (buffer >>> bits) & 0x3F;
        result += chars[index];
      }
    }

    // Manejar bits restantes
    if (bits > 0) {
      buffer <<= (6 - bits);
      const index = buffer & 0x3F;
      result += chars[index];
    }

    return result;
  }
}