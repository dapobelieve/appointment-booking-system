import { Repository, UpdateResult } from 'typeorm';
import { ConflictException, Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { PageInfo, PaginatedRecordsDto, QueryParamsDto } from '../../common/dtos/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
  ) {}
  async create(data: Partial<User>): Promise<User> {
    try {
      const user = this._userRepository.create(data);
      return this._userRepository.save(user);
    } catch (e) {
      if (e.code === 'P2002') {
        throw new ConflictException({
          statusCode: 409,
          message: 'This user already exists',
        });
      }
      throw e;
    }
  }

  async findOneBy(
    data: { email?: string; id?: any },
    selectFields?: (keyof User)[],
  ): Promise<User> | undefined {
    return this._userRepository.findOne({
      where: data,
      select: selectFields?.length ? selectFields : null,
    });
  }

  async findAll(query: QueryParamsDto): Promise<PaginatedRecordsDto<User>> {
    const { startsAt, sortOrder, sortBy, page, limit, endsAt, ...rest } = query;
    const _query = this._userRepository.createQueryBuilder('users');

    Object.entries(rest).forEach(([key, value]) => {
      if (value) {
        _query.andWhere(`users.${key} = :${key}`, { [key]: value });
      }
    });

    if (startsAt && endsAt) {
      _query.andWhere(`users.createdAt BETWEEN :startsAt AND :endsAt`, {
        startsAt,
        endsAt,
      });
    }

    const totalCountQuery = _query.clone();

    _query
      .orderBy(`users.${sortBy}`, sortOrder)
      .skip((page - 1) * limit)
      .take(limit);

    const [total, data] = await Promise.all([totalCountQuery.getCount(), _query.getMany()]);

    const pageInfo: PageInfo = {
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit),
    };

    return { data, pageInfo };
  }

  async findUsers(ids: string[]): Promise<User[]> {
    return this._userRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.firstName', 'user.lastName', 'user.profilePhoto'])
      .where('user.id IN (:...ids)', { ids })
      .andWhere('user.isBanned = :isBanned', { isBanned: false })
      .getRawMany();
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    try {
      await this._userRepository
        .createQueryBuilder('user')
        .update(User)
        .set({ ...data })
        .where('id = :id', { id })
        .execute();
      return this.findOneBy({ id });
    } catch (e) {
      throw e;
    }
  }
}
