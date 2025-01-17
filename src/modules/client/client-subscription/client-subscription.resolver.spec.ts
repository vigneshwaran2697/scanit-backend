import { Test, TestingModule } from '@nestjs/testing';
import { ClientSubscriptionResolver } from './client-subscription.resolver';
import { ClientSubscriptionService } from './client-subscription.service';

describe('ClientSubscriptionResolver', () => {
  let resolver: ClientSubscriptionResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientSubscriptionResolver, ClientSubscriptionService],
    }).compile();

    resolver = module.get<ClientSubscriptionResolver>(ClientSubscriptionResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
