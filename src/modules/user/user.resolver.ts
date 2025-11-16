import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

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

  @Mutation(() => String)
  async sendForgotPasswordMail(@Args('emailId') emailId: string): Promise<string> {
    return this.userService.sendForgotPasswordMail(emailId);
  }

  @Query(() => String)
  async verifyResetPasswordToken(@Args('token') token: string): Promise<string> {
    return this.userService.verifyResetPasswordToken(token);
  }

  @Mutation(() => String)
  async resetPassword(
    @Args('token') token: string,
    @Args('newPassword') newPassword: string,
  ): Promise<string> {
    return this.userService.resetPassword(token, newPassword);
  }
}
