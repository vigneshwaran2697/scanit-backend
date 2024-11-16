import { Inject, Injectable } from '@nestjs/common';
import { SsmService } from '../aws/ssm/ssm.service';
import { config as configData } from '../config/config';
import { StoreVal } from 'src/utils/common.types';

const config = configData[process.env.NODE_ENV || 'development'];

@Injectable()
export class AuthConfiguration {
  constructor(@Inject('SsmService') private readonly service: SsmService) {}

  public getData() {
    const storeVal: StoreVal = config.appConfig;
    return {
      ClientId: storeVal.ClientId,
      PoolId: storeVal.PoolId,
      region: config.region,
      authority: `https://cognito-idp.${storeVal.region}.amazonaws.com/${storeVal.PoolId}`,
    };
  }
}
