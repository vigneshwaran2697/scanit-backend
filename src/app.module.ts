import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import dbConfig from './database/db.config';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { CognitoModule } from './aws/cognito/cognito.module';
import { S3Module } from './aws/s3/s3.module';
import { SsmModule } from './aws/ssm/ssm.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [dbConfig],
    }),
    DatabaseModule,
    UserModule,
    CognitoModule,
    S3Module,
    SsmModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
