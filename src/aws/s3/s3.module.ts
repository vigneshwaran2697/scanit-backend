import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { S3Resolver } from './s3.resolver';
import { SignedUrlService } from './s3signedurl.service';
import { SsmService } from '../ssm/ssm.service';

@Module({

  providers: [S3Resolver, S3Service, SignedUrlService, SsmService],
})
export class S3Module {}
