import { BadRequestException, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import dbConfig from './db.config';
import { DataSource } from 'typeorm';
import {
  initializeTransactionalContext,
  addTransactionalDataSource,
} from 'typeorm-transactional';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [dbConfig],
        }),
      ],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return { ...configService.get('typeOrmConfig') };
      },
      async dataSourceFactory(options) {
        if (!options) {
          throw new BadRequestException('Invalid options passed');
        }
        initializeTransactionalContext();
        return addTransactionalDataSource(new DataSource(options));
      },
    }),
  ],
  providers: [],
})
export class DatabaseModule {}
