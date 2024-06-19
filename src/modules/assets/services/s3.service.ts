import * as Buffer from 'buffer';
import { S3 } from 'aws-sdk';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service implements StorageProvider {
  private s3: S3;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    this.s3 = new S3({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get('AWS_REGION'),
    });

    this.bucketName = this.configService.get('AWS_S3_BUCKET_NAME');
  }

  delete(fileUrl: string): Promise<void> {
    return Promise.resolve(undefined);
  }

  async upload(
    fileBuffer: Buffer,
    fileName: string,
    folderName?: string,
    type?: string,
  ): Promise<string> {
    const folderPrefix = folderName ? `${folderName.replace(/\/$/, '')}/` : '';
    const key = `${folderPrefix}${Date.now()}_${fileName}`;

    const uploadResult = await this.s3
      .upload({
        Bucket: this.bucketName,
        Key: key,
        Body: fileBuffer,
        ContentType: type,
      })
      .promise();

    return `https://d1suw1zy6b0vta.cloudfront.net/${
      uploadResult.Location.split('com/')[1]
    }`;
  }
}
