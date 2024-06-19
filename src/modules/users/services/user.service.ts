import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../entities/user.entity';
import { UpdateUserDto } from '../../iam/authentication/dtos/auth.dto';
import { UserRole } from '../../common/enums/role.enum';
import { PaginatedRecordsDto, QueryParamsDto } from '../../common/dtos/pagination.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findOne(id: string): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  async me(id: string): Promise<any> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new BadRequestException('(User not found)');
    }

    return {
      ...user,
    };
  }

  async update(userId: string, data: UpdateUserDto) {
    const { fcmToken, profilePhoto, username } = data;
    return this.userRepository.update(userId, data);
  }

  /**
   * Admin methods
   */
  async getAdminUsers(query: QueryParamsDto): Promise<PaginatedRecordsDto<User> | null> {
    return this.userRepository.findAll(query);
  }
}
