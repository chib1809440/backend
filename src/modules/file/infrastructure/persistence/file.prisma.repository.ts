/* eslint-disable @typescript-eslint/require-await */
import { File } from '../../domain/entities/file.entity';
import { FileRepository } from '../../domain/repositories/file.repository';

export class FilePrismaRepository implements FileRepository {
  async save(entity: File): Promise<void> {
    console.log('[DB] Saving file:', entity);
  }
}
