import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class CognitoAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx?.getContext()?.req;
    const xForwardedForHeader = req?.headers['x-forwarded-for'];
    let ipAddress;
    if (xForwardedForHeader) {
      const ipAddresses = xForwardedForHeader?.split(',');
      ipAddress = ipAddresses[0]?.trim();
    }
    // console.log("============getxForwardedForHeader", xForwardedForHeader)
    // console.log("============getipAddress", ipAddress)
    // console.log("============getReq", req)
    return ctx.getContext().req;
  }
}
