import { Module } from '@nestjs/common';
import { CreateFileUseCase } from './application/usecases/create-file.usecase';
import { GetFileUseCase } from './application/usecases/get-file.usecase';
import { FILE_STORAGE } from './domain/ports/file-storage.port';
import { MinioStorage } from './infrastructure/storage/minio.storage';
import { FileController } from './presentation/file.controller';

@Module({
  controllers: [FileController],
  providers: [
    CreateFileUseCase,
    GetFileUseCase,
    {
      provide: FILE_STORAGE,
      useClass: MinioStorage,
    },
  ],
})
export class FileModule {}
