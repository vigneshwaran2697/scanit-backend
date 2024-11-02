import { registerAs } from '@nestjs/config';
import devConfig from './dev.config';
import { SsmService } from '../aws/ssm/ssm.service';

export default registerAs('typeOrmConfig', async () => {
  // eslint-disable-next-line prefer-const
  let data;
  if (process.env.USE_LOCAL_DB === 'true') {
    data = devConfig();
  } else {
    data = await SsmService.getDbConfigFromAws();
  }
  const dbSync = process.env.DB_SYNC === 'true';
  return {
    // eslint-disable-next-line @typescript-eslint/prefer-as-const
    type: 'postgres' as 'postgres',
    host: data.host,
    port: parseInt(data.port),
    username: data.username,
    password: data.password,
    database: data.dbName,
    autoLoadEntities: true,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    subscribers: [__dirname + '/../**/*.subscriber{.ts,.js}'],
    migrations: [__dirname + '/./migrations/**/*{.ts,.js}'],
    cli: {
      migrationsDir: __dirname + '/../migrations',
    },
    synchronize: dbSync,
    logging: true,
    pool: {
      max: 25,
      min: 1,
      maxWaitingClients: 10,
      idleTimeoutMillis: 300000,
    },
  };
});
