import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { S3 } from 'aws-sdk';
import { assign } from 'lodash';
import { removeDoubleSlash } from 'src/utils';

@Injectable()
export class UploadService {
  private bucket = process.env.S3_BUCKET;

  private assetEndpoint = process.env.S3_ASSETS_ENDPOINT;

  private s3 = new S3({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    endpoint: process.env.S3_ENDPOINT,
  });

  public async upload(file, basePath: string) {
    const path = this.generatePath(basePath, file.originalname);

    const params = {
      Bucket: this.bucket,
      Key: path,
      Body: file.buffer,
      ACL: 'public-read',
      ContentType: file.mimetype,
      ContentDisposition: 'inline',
    };

    try {
      const response = await this.s3.upload(params).promise();
      const assetLocation = this.assetEndpoint + '/' + response.Key;

      assign(response, {
        url: removeDoubleSlash(assetLocation),
      });

      return response;
    } catch (e) {
      return e;
    }
  }

  private getFilePathFromUrl(sourceUrl: string): string {
    const assetEndpoint = removeDoubleSlash(this.assetEndpoint + '/');
    return 'cache/' + sourceUrl.replace(assetEndpoint, '');
  }

  private generatePath(basePath: string, fileName: string): string {
    const uuid = uuidv4();
    const a = uuid.charAt(0);
    const b = uuid.charAt(1);
    const absolutePath =
      basePath + '/' + a + '/' + b + '/' + uuid + '/' + fileName;
    return removeDoubleSlash(absolutePath);
  }
}
