import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Param,
  Res,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('/api')
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

  @Post('/upload/:path(*)')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @Param('path') path,
    @Res() res,
    @UploadedFile() file,
  ): Promise<any> {
    const result = await this.uploadService.upload(file, path);
    return res.json(result);
  }
}
