import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class TrimPipe implements PipeTransform {
  transform(name: string, metadata: ArgumentMetadata) {
    if (typeof name !== 'string') {
      throw new BadRequestException('Invalid parameter type');
    }

    const trimmed = name.trim();

    if (!trimmed.length) {
      throw new BadRequestException(
        `${metadata.data ?? 'param'} must not be empty`,
      );
    }

    return trimmed;
  }
}
