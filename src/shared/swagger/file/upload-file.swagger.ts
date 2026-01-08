import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

export function UploadFileSwagger() {
  return applyDecorators(
    ApiTags('Files'),
    ApiBearerAuth('access-token'),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'File uploaded successfully',
      schema: {
        example: {
          key: '1700000000-image.png',
          url: 'http://localhost:9000/uploads/1700000000-image.png',
          size: 34567,
          mimeType: 'image/png',
        },
      },
    }),
  );
}
