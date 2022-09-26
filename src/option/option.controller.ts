import { Controller, Res, Get } from '@nestjs/common';
import { Response } from 'express';
import { Public } from 'src/auth/decorators/public.decorator';
import { OptionService } from './option.service';

@Public()
@Controller('/api/options')
export class OptionController {
  constructor(private readonly optionvice: OptionService) {}

  @Get('/')
  async list(@Res() res: Response): Promise<any> {
    const result = await this.optionvice.list();
    return res.json({
      status: true,
      data: result,
    });
  }
}
