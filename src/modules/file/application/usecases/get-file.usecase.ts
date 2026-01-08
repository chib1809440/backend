/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Inject } from '@nestjs/common';
import {
  FILE_STORAGE,
  FileStorage,
} from '../../domain/ports/file-storage.port';

export class GetFileUseCase {
  constructor(
    @Inject(FILE_STORAGE)
    private readonly storage: FileStorage,
  ) {}

  async execute(key: string) {
    return this.storage.getStream(key);
  }
}
