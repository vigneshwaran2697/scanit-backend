import { SetMetadata } from '@nestjs/common';
import { UserRoles } from 'src/utils/app-constants';


export const Roles = (...roles: UserRoles[]) => SetMetadata('roles', roles);
