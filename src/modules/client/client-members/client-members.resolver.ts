import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ClientMembersService } from './client-members.service';
import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CognitoAuthGuard } from 'src/auth/guards/cognito.guard';
import { RolesGuard } from 'src/auth/guards/role-auth.guard';
import { UserRoles } from 'src/utils/app-constants';
import { CreateMemberInput } from './dto/create-member.input';
import { CurrentUser } from 'src/auth/decorators/currentuser.decorator';
import { User } from '../../user/entities/user.entity';
import { Members } from './entity/client-members.entity';
import { UpdateMemberInput } from './dto/update-member.input';

@Resolver()
export class ClientMembersResolver {
  constructor(private readonly clientMembersService: ClientMembersService) {}

  @UseGuards(CognitoAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @Mutation(() => String, { name: 'createUser' })
  public async createMember(
    @Args('createMemberInput') createMemberInput: CreateMemberInput,
    @CurrentUser() user: User,
  ): Promise<string> {
    return this.clientMembersService.createMember(createMemberInput, user);
  }


  @UseGuards(CognitoAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @Query(() => [Members], { name: 'getAllUsers' })
  public async getAllMember(
    @Args('search') search: string,
    @Args('limit') limit: number,
    @Args('offset') offset: number,
    @CurrentUser() user: User,
  ): Promise<Members[]> {
    return this.clientMembersService.getAllMembers(search, limit, offset , user);
  }

  @UseGuards(CognitoAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @Query(() => Members, { name: 'getUserById' })
  public async getMemberById(
    @Args('memberId') memberId: string,
    @CurrentUser() user: User,
  ): Promise<Members> {
    return this.clientMembersService.getMemberById(memberId, user);
  }

  @UseGuards(CognitoAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @Mutation(() => String, { name: 'updateUser' })
  public async updateMember(
    @Args('updateMemberInput') updateMemberInput: UpdateMemberInput,
    @CurrentUser() user: User,
  ): Promise<String>{
    return this.clientMembersService.updateMember(updateMemberInput, user);
  }
}
