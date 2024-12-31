import { Test, TestingModule } from '@nestjs/testing';
import { ClientMembersResolver } from './client-members.resolver';
import { ClientMembersService } from './client-members.service';

describe('ClientMembersResolver', () => {
  let resolver: ClientMembersResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientMembersResolver, ClientMembersService],
    }).compile();

    resolver = module.get<ClientMembersResolver>(ClientMembersResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
