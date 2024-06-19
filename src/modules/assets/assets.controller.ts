import {
  Controller,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AssetsService } from './services/assets.service';
import { FileSizeValidatorPipe } from './pipes/file-size.pipe';

@Controller('v1/assets')
export class AssetsController {
  constructor(private readonly assetService: AssetsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(FileSizeValidatorPipe)
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [],
      }),
    )
    file: Express.Multer.File,
  ): Promise<{ url: string }> {
    const url = await this.assetService.saveFile(file);
    return { url };
  }
}
