import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { SuperAdminService } from './super-admin.service';
import { User } from '../user/entities/user.entity';
import { CreateSuperAdminInput } from '../user/dto/create-user.input';
import { UseGuards } from '@nestjs/common';
import { CognitoAuthGuard } from 'src/auth/guards/cognito.guard';
import { RolesGuard } from 'src/auth/guards/role-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRoles } from 'src/utils/app-constants';

@Resolver()
@UseGuards(CognitoAuthGuard, RolesGuard)
export class SuperAdminResolver {
  constructor(private readonly superAdminService: SuperAdminService) {}

  @Roles(UserRoles.SUPER_ADMIN)
  @Mutation(() => User)
  async createSuperAdmin(@Args('createSuperAdminInput') createSuperAdminInput: CreateSuperAdminInput): Promise<User> {
    return this.superAdminService.createSuperAdmin(createSuperAdminInput);
  }
}
