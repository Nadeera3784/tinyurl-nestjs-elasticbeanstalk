import { nanoid } from 'nanoid';

export class ShortCodeUtil {
  private static readonly DEFAULT_LENGTH = 8;
  private static readonly ALPHABET =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  static generate(length: number = this.DEFAULT_LENGTH): string {
    return nanoid(length);
  }

  static generateCustom(length: number = this.DEFAULT_LENGTH): string {
    const customNanoid = (len: number) => {
      let result = '';
      for (let i = 0; i < len; i++) {
        result += this.ALPHABET.charAt(
          Math.floor(Math.random() * this.ALPHABET.length),
        );
      }
      return result;
    };
    return customNanoid(length);
  }

  static isValid(shortCode: string): boolean {
    if (!shortCode || shortCode.length < 4 || shortCode.length > 20) {
      return false;
    }
    const validCharsRegex = /^[a-zA-Z0-9_-]+$/;
    return validCharsRegex.test(shortCode);
  }

  static clean(customCode: string): string {
    return customCode
      .trim()
      .toLowerCase()
      .replace(/[^a-zA-Z0-9_-]/g, '')
      .substring(0, 20);
  }
}
