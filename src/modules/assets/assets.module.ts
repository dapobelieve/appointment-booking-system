import { Module } from '@nestjs/common';
import { CloudinaryService } from './services/cloudinary.service';
import { AssetsService } from './services/assets.service';
import { AssetsController } from './assets.controller';
import { S3Service } from './services/s3.service';

@Module({
  imports: [],
  controllers: [AssetsController],
  providers: [S3Service, AssetsService],
})
export class AssetsModule {}
