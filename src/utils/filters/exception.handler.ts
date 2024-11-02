import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { UnauthenticatedException } from '../exceptions/unauthenticated.exception';

@Catch(UnauthenticatedException)
export class HttpExceptionFilter implements GqlExceptionFilter<HttpException> {
  catch(exception: HttpException, host: ArgumentsHost) {
    console.log('In exception***************' + JSON.stringify(exception));
    return exception;
  }
}
