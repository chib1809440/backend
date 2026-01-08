/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Inject } from '@nestjs/common';
import {
  FILE_STORAGE,
  FileStorage,
} from '../../domain/ports/file-storage.port';
import { randomUUID } from 'crypto';

export class CreateFileUseCase {
  constructor(
    @Inject(FILE_STORAGE)
    private readonly storage: FileStorage,
  ) {}

  execute(file: Express.Multer.File) {
    const key = `${Date.now()}-${randomUUID()}.png`;

    return this.storage.upload(file.buffer, key, file.mimetype);
  }
}
