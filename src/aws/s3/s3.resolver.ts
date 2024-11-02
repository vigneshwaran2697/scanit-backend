import { Args, Query, Resolver } from '@nestjs/graphql';
import { S3Object } from './entities/s3.entity';
import { S3Service } from './s3.service';

@Resolver()
export class S3Resolver {
  constructor(private readonly s3Service: S3Service) {}

  @Query(() => S3Object, { name: 'getSignedUrlForDownload' })
  async getDownloadSignedUrl(
    @Args('key') key: string,
    @Args('bucketName') bucketName: string,
  ): Promise<S3Object> {
    return this.s3Service.getSignedUrlForDownload(bucketName, key);
  }

  @Query(() => S3Object, { name: 'getSignedUrlForUpload' })
  async getUploadSignedUrl(
    @Args('key') key: string,
    @Args('bucketName') bucketName: string,
  ): Promise<S3Object> {
    return this.s3Service.getSignedUrlForUpload(bucketName, key);
  }

  @Query(() => String)
  async s3FileDelete(
    @Args('bucketName', { nullable: false }) bucketName: string,
    @Args('key', { nullable: false }) key: string,
  ) {
    return this.s3Service.deleteS3File(bucketName, key);
  }
}
