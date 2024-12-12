import { Controller, Get, Inject } from '@nestjs/common';
import { SsmService } from './ssm.service';

@Controller('api/params')
export class SSMController {
  constructor(@Inject('SsmService') private readonly ssmService: SsmService) {}

  @Get('/refresh')
  public async webhooks() {
    return SsmService.updateParams();
  }
}
