/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ServiceName } from 'src/shared/logger/decorators/service-name.decorator';
import { GetFileSwagger } from 'src/shared/swagger/file/get-file.swagger';
import { UploadFileSwagger } from 'src/shared/swagger/file/upload-file.swagger';
import { CreateFileUseCase } from '../application/usecases/create-file.usecase';
import { GetFileUseCase } from '../application/usecases/get-file.usecase';

@ServiceName('file-service')
@ApiTags('Files')
@ApiBearerAuth('access-token')
@Controller('files')
export class FileController {
  constructor(
    private readonly createFile: CreateFileUseCase,
    private readonly getFileUseCase: GetFileUseCase,
  ) {}

  @Post('upload')
  @UploadFileSwagger()
  @UseInterceptors(FileInterceptor('file'))
  @ServiceName('file-upload')
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.createFile.execute(file);
  }

  @Get(':key')
  @GetFileSwagger()
  async getFile(@Param('key') key: string, @Res() res: Response) {
    try {
      const { stream, mimeType } = await this.getFileUseCase.execute(key);

      res.setHeader('Content-Type', mimeType);
      stream.pipe(res);
    } catch {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }
  }
}
