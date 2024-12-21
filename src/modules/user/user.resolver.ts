import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateSuperAdminInput } from './dto/create-user.input';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => String, { name: 'signIn', nullable: true })
  async signIn(
    @Args('emailId') emailId: string,
    @Args('password') password: string,
  ): Promise<string> {
    return this.userService.singIn(emailId, password);
  }

  @Mutation(() => User)
  async createSuperAdmin(@Args('createSuperAdminInput') createSuperAdminInput: CreateSuperAdminInput): Promise<User> {
    return this.userService.createSuperAdmin(createSuperAdminInput);
  }
}
