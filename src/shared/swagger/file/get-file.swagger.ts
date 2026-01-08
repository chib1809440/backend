import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

export function GetFileSwagger() {
  return applyDecorators(
    ApiTags('Files'),

    ApiOperation({
      summary: 'Get file by key',
      description: 'Stream file content (image, video, document)',
    }),

    ApiParam({
      name: 'key',
      type: String,
      description: 'File key stored in object storage',
      example: '1700000000-image.png',
    }),

    // 👇 quan trọng nhất
    ApiProduces(
      'image/png',
      'image/jpeg',
      'video/mp4',
      'application/pdf',
      'application/octet-stream',
    ),

    ApiResponse({
      status: 200,
      description: 'Binary file stream',
      content: {
        'application/octet-stream': {
          schema: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    }),

    ApiResponse({
      status: 404,
      description: 'File not found',
    }),
  );
}
