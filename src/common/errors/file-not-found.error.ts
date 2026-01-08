import { BusinessError } from './business.error';

export class FileNotFoundError extends BusinessError {
  constructor(fileKey: string) {
    super('FILE_NOT_FOUND', `File not found: ${fileKey}`);
  }
}
