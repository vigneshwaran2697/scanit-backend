import { Test, TestingModule } from '@nestjs/testing';
import { ClientMembersService } from './client-members.service';

describe('ClientMembersService', () => {
  let service: ClientMembersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientMembersService],
    }).compile();

    service = module.get<ClientMembersService>(ClientMembersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
