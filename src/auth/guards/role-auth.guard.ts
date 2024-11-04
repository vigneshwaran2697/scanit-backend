import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User, UserRole } from '../../modules/user/entities/user.entity';
import { UserRoles } from '../../utils/app-constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles =
      this.reflector.get<UserRoles[]>('roles', context.getHandler()) ||
      this.reflector.get<UserRoles[]>('roles', context.getClass());

    if (!roles) {
      return true;
    }
    const ctx = GqlExecutionContext.create(context); //create graphql execution context out of execution context
    const request = ctx.getContext().req;
    if (!request) {
      return true;
    }
    const user: User = request.user;
    const userRole =
      user.userRole === UserRole.SUPER_ADMIN || user.userRole

    console.log('userRole is ' + userRole);
    console.log('Roles Allowed ' + roles);
    const hasRole = (role) => {
      return roles.some((x) => role.indexOf(x) >= 0);
    };
    if (!(userRole && hasRole(userRole))) {
      throw new UnauthorizedException(
        `Only ${roles} can able to access this API!`,
      );
    }
    return true;
  }
}
