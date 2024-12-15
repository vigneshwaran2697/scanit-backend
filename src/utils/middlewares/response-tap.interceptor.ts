import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    const { originalUrl, params, query, body } = req;
    if (originalUrl !== '/health') {
      return next.handle().pipe(
        tap((data) =>
          console.log(
            `Request Url ---> ${originalUrl}`,
            `Request Body ---> ${JSON.stringify(body)}`,
            `Params---> ${JSON.stringify(params)}`,
            `Query ---> ${JSON.stringify(query)}`,
            // `Response body ---> ${
            //   (originalUrl !== '/sms/inbound' || originalUrl !== '/sms/leadgen') ? JSON.stringify(data) : ''
            // }`,
            ResponseInterceptor.name,
          ),
        ),
      );
    } else {
      return next.handle();
    }
  }
}