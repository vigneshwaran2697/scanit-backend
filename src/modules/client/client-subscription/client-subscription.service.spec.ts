import { Test, TestingModule } from '@nestjs/testing';
import { ClientSubscriptionService } from './client-subscription.service';

describe('ClientSubscriptionService', () => {
  let service: ClientSubscriptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientSubscriptionService],
    }).compile();

    service = module.get<ClientSubscriptionService>(ClientSubscriptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
