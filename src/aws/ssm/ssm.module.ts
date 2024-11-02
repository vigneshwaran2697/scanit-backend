import { Module } from '@nestjs/common';
import { SSMController } from './ssm.controller';
import { SsmService } from './ssm.service';

const ssmService = {
  provide: 'SsmService',
  useFactory: async () => {
    await SsmService.getInstance();
  },
};

@Module({
  providers: [ssmService],
  exports: ['SsmService'],
  controllers: [SSMController],
})
export class SsmModule {}
