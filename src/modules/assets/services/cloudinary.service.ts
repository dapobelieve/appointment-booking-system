import { v2 as cloudinary } from 'cloudinary';
import { fileTypeFromBuffer } from 'file-type';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CloudinaryService implements StorageProvider {
  constructor() {
    cloudinary.config({
      // cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      // api_key: this.configService.get('CLOUDINARY_API_KEY'),
      // api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
      cloud_name: 'believe',
      api_key: '211485774919991',
      api_secret: 'S52i_vdv5B8O37U7zpwyjEIjXzk',
    });
  }
  async upload(fileBuffer: Buffer, fileName: string): Promise<any> {
    // const type = await fileTypeFromBuffer(fileBuffer);
    // if (!type) {
    //   throw new Error('Unable to determine file type.');
    // }
    // const dataUri = `data:${type.mime};base64,${fileBuffer.toString('base64')}`;
    // const result = await cloudinary.uploader.upload(dataUri, {
    //   folder: 'oj',
    // });
    // return result.uri;
  }

  async delete(fileUrl: string): Promise<void> {
    // Delete file from Cloudinary
  }
}
