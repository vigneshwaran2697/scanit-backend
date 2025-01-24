import { Injectable } from '@nestjs/common';
import { CreateMemberInput } from './dto/create-member.input';
import { ClientMembersRepository } from './client-members.repository';
import { User } from 'src/modules/user/entities/user.entity';
import { Members } from './entity/client-members.entity';
import { UpdateMemberInput } from './dto/update-member.input';

@Injectable()
export class ClientMembersService {
    constructor(private readonly memberRepo: ClientMembersRepository) {}
    async createMember(createMemberInput: CreateMemberInput, user: User): Promise<string> {
        const member = await this.memberRepo.createMember(createMemberInput, user);
        if (!member) {
            throw new Error('Failed to create member');
        }
        return 'Member created successfully';
    }

    async getAllMembers(search: string, limit: number, offset: number , user: User): Promise<Members[]> {
        const members = this.memberRepo.createQueryBuilder('members')
            .where('members.clientId = :clientId', { clientId: user.clientId });
        if (search) {
            members.where('members.fullName LIKE :search', { search: `%${search}%` });
        }
        members.orderBy('members.updatedAt', 'DESC');
        if (limit) {
            members.limit(limit);
        }
        if (offset) {
            members.offset(offset);
        }
        return members.getMany();
    }

    async getMemberById(memberId: string, user: User): Promise<Members> {
        const member = await this.memberRepo.createQueryBuilder('members')
            .where('members.clientId = :clientId', { clientId: user.clientId })
            .andWhere('members.id = :memberId', { memberId })
            .getOne();
        if (!member) {
            throw new Error('Member not found');
        }
        return member;
    }

    async updateMember(updateMemberInput: UpdateMemberInput): Promise<string> {
        if (!updateMemberInput.id) {
            throw new Error('User id is required');
        }
        const id = updateMemberInput.id;
        delete updateMemberInput.id;
        if (updateMemberInput.isActive === undefined || updateMemberInput.isActive === null) {
            delete updateMemberInput.isActive;
        }
        const member = await this.memberRepo.update({ id }, {
            ...updateMemberInput,
                })
        if (!member) {
            throw new Error('Failed to update member');
        }
        return 'Member updated successfully';
    }

    async getQRData(memberId: string): Promise<Members> {
        const member = await this.memberRepo.createQueryBuilder('members')
            .where('members.id = :memberId', { memberId })
            .getOne();
        if (!member) {
            throw new Error('Member not found');
        }
        return member;
    }
}
