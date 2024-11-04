import { Injectable } from '@nestjs/common';
import { S3Object } from './entities/s3.entity';
import { S3 } from 'aws-sdk';
import { config as configData } from '../../config/config';
import { parseUrl } from '@aws-sdk/url-parser';

const config = configData[process.env.NODE_ENV || 'development'];

@Injectable()
export class S3Service {
  public async getSignedUrl(reqType, bucketName, key) {
    const signedUrlExpireSeconds = 60 * 60;

    const s3 = new S3({
      region: config.region,
      signatureVersion: 'v4',
    });
    const url = await s3.getSignedUrlPromise(`${reqType}Object`, {
      Bucket: bucketName,
      Key: key,
      Expires: signedUrlExpireSeconds,
    });
    return new S3Object({
      preSignedUrl: url,
    });
  }

  public async getPreSignedUrl(objectUrl: string) {
    const s3ObjectUrl = parseUrl(`${objectUrl}`);
    const bucketName = s3ObjectUrl.hostname.substring(
      0,
      s3ObjectUrl.hostname.indexOf('.'),
    );
    const key = s3ObjectUrl.path.substring(1);

    return this.getSignedUrl('get', bucketName, key);
  }

  public async getDataFromS3Url(objectUrl: string) {
    const s3ObjectUrl = parseUrl(`${objectUrl}`);
    const bucketName = s3ObjectUrl.hostname.substring(
      0,
      s3ObjectUrl.hostname.indexOf('.'),
    );
    const key = s3ObjectUrl.path.substring(1);

    const s3 = new S3({
      region: config.region,
      signatureVersion: 'v4',
    });
    const params = { Bucket: bucketName, Key: key };
    const response = await s3.getObject(params).promise();
    return response.Body.toString('base64');
  }

  public async moveCallRecordingToClientDir(
    clientId: string,
    brandId: string,
    objectUrl: string,
    destinationBucket: string,
  ) {
    const s3ObjectUrl = parseUrl(`${objectUrl}`);
    const bucketName = s3ObjectUrl.hostname.substring(
      0,
      s3ObjectUrl.hostname.indexOf('.'),
    );
    const key = s3ObjectUrl.path.substring(1);

    const destinationKey = `call-recordings/${clientId}/${brandId}/${key}`;

    const params = {
      Bucket: destinationBucket,
      CopySource: `${bucketName}/${key}`,
      Key: destinationKey,
    };
    const s3 = new S3({
      region: config.region,
      signatureVersion: 'v4',
    });
    const deleteparams = {
      Bucket: bucketName,
      Key: key,
    };
    try {
      const data = await s3.copyObject(params).promise();
      if (data.$response.httpResponse.statusCode === 200) {
        await s3.deleteObject(deleteparams).promise();
        return this.getUrlFromBucket(destinationBucket, destinationKey);
      }
    } catch (e) {
      console.error(e);
    }
    return this.getUrlFromBucket(bucketName, key);
  }

  public async getSignedUrlForUpload(bucketName, key) {
    return this.getSignedUrl('put', bucketName, key);
  }

  public async getSignedUrlForDownload(bucketName, key) {
    return this.getSignedUrl('get', bucketName, key);
  }
  getUrlFromBucket(bucketName: string, key: string): string {
    return `https://${bucketName}.s3.amazonaws.com/${key}`;
  }

  //delete s3 file
  public async deleteS3File(bucket: string, key: string) {
    if (!bucket || !key) {
      throw new Error('Bucket name or key required');
    }
    const params = {
      Bucket: bucket,
      Key: key,
    };
    const s3 = new S3({
      signatureVersion: 'v4',
      region: config.region,
    });
    try {
      await s3.headObject(params).promise();
      s3.deleteObject(params, function (err, data) {
        if (err) {
          console.log(err, err.stack);
          throw err.stack; // error;
        }
      });
    } catch (err) {
      throw new Error(`File not Found ERROR : ${err.code}`);
    }
    return 'Deleted successfully';
  }

  public async uploadDocument(key, buffer) {
    const params = {
      Key: key,
      Body: Buffer.from(buffer, 'base64'),
      Bucket: config.appConfig.mediaBucket,
      ContentType: 'application/pdf'
    };
    const s3 = new S3({
      region: config.region,
      signatureVersion: 'v4',
    });
    return s3.upload(params).promise();
  }
}
