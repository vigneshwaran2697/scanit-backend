import { Module } from '@nestjs/common';
import { ClientSubscriptionService } from './client-subscription.service';
import { ClientSubscriptionResolver } from './client-subscription.resolver';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientSubscription } from './entities/client-subscription.entity';
import { ClientSubscriptionRepository } from './client-subscription.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ClientSubscription])],
  providers: [ClientSubscriptionResolver, ClientSubscriptionService, ClientSubscriptionRepository],
  exports: [ClientSubscriptionResolver, ClientSubscriptionService, ClientSubscriptionRepository],
})
export class ClientSubscriptionModule {}
