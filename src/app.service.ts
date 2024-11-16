import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { UserService } from './modules/user/user.service';

@Injectable()
export class AppService implements OnApplicationBootstrap {

  constructor(private readonly userService: UserService) {}
  async onApplicationBootstrap() {
    // await this.userService.createSuperAdminUser();
  }
}
