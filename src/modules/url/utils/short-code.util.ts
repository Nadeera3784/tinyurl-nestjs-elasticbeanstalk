import { nanoid } from 'nanoid';

export class ShortCodeUtil {
  private static readonly DEFAULT_LENGTH = 8;

  static generate(length: number = this.DEFAULT_LENGTH): string {
    return nanoid(length);
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
