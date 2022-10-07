import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CompanyService } from './company.service';

@Injectable()
export class CompanySchedule {
  private logger = new Logger(CompanySchedule.name);
  constructor(private readonly companyService: CompanyService) {}

  @Cron(CronExpression.EVERY_YEAR)
  async resetCounter(): Promise<void> {
    this.logger.log('Reset company counter in new year');
    await this.companyService.resetCounter();
  }
}
