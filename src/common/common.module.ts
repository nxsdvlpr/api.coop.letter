import { Global, Module } from '@nestjs/common';

import { CommonService } from './common.service';
import { SiDScalar } from './sid.scalar';

@Global()
@Module({
  imports: [],
  providers: [CommonService, SiDScalar],
  exports: [CommonService],
})
export class CommonModule {}
