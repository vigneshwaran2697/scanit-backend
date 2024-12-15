import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './utils/filters/exception.handler';
import { ResponseInterceptor } from './utils/middlewares/response-tap.interceptor';
const appPort = process.env.PORT || 3000;

async function bootstrap() {
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.enableCors();
    app.useGlobalFilters(new HttpExceptionFilter());
    // app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: false }));
    await app.listen(appPort);
    Logger.log('Scanit server started @ port number ' + appPort);
  } catch (e) {
    Logger.error(`❌  Error starting server, ${e}`, '', 'Bootstrap', false);
    process.exit();
  }
}

bootstrap().catch((e) => {
  Logger.error(`?  Error starting server, ${e}`, '', 'Bootstrap', false);
  throw e;
});
