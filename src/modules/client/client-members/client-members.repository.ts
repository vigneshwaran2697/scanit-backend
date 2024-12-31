import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/database/base.respoitory';
import { Members } from './entity/client-members.entity';
import { DataSource } from 'typeorm';
import { CreateMemberInput } from './dto/create-member.input';
import { User } from 'src/modules/user/entities/user.entity';

@Injectable()
export class ClientMembersRepository extends BaseRepository<Members> {
  constructor(private readonly dataSource: DataSource) {
    super(Members, dataSource.createEntityManager());
  }

  async createMember(createMemberInput: CreateMemberInput, user: User) {
    const member = await this.save({
      fullName: createMemberInput.fullName,
      sonOf: createMemberInput.sonOf,
      dob: createMemberInput.dob,
      employeeId: createMemberInput.employeeId,
      presentAddress: createMemberInput.presentAddress,
      permanentAddress: createMemberInput.permanentAddress,
      designation: createMemberInput.designation,
      dateOfJoining: createMemberInput.dateOfJoining,
      photograph: createMemberInput.photograph,
      aadhaarCard: createMemberInput.aadhaarCard,
      phoneNumber: createMemberInput.phoneNumber,
      emailId: createMemberInput.emailId,
      clientId: user.clientId,
      isActive: true,
      gender: createMemberInput.gender,
      idIssueDate: createMemberInput.idIssueDate,
      expiryDate: createMemberInput.expiryDate,
    });
    return member;
  }
}
