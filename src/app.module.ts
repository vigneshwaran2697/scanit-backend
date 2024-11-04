import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import dbConfig from './database/db.config';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './modules/user/user.module';
import { CognitoModule } from './aws/cognito/cognito.module';
import { S3Module } from './aws/s3/s3.module';
import { SsmModule } from './aws/ssm/ssm.module';
import { AuthModule } from './auth/auth.module';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphQLDate } from 'graphql-scalars';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UserService } from './modules/user/user.service';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [dbConfig],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: './graphqlschema.gql',
      driver: ApolloDriver,
      sortSchema: true,
      debug: false,
      playground: true,
      context: ({ req }) => ({ headers: req.headers }),
      buildSchemaOptions: {
        scalarsMap: [{ type: () => GraphQLDate, scalar: GraphQLDate }],
      },
    }),
    DatabaseModule,
    UserModule,
    CognitoModule,
    S3Module,
    SsmModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, UserService],
})
export class AppModule {}
