import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class FileSizeValidatorPipe implements PipeTransform {
  private readonly maxSize = 5 * 1024 * 1024;
  private readonly allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/pdf',
  ];

  transform(
    value: Express.Multer.File,
    metadata: ArgumentMetadata,
  ): Express.Multer.File {
    if (!value) throw new BadRequestException('File must be provided.');

    if (value.size > this.maxSize) {
      throw new BadRequestException(
        'File size exceeds the maximum size of 5MB.',
      );
    }

    if (!this.allowedTypes.includes(value.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only JPEG, JPG, PNG, and PDF are allowed.',
      );
    }

    return value;
  }
}
