import { File } from '../entities/file.entity';

export abstract class FileRepository {
  abstract save(entity: File): Promise<void>;
}
