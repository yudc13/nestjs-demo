import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateUserDto, UserPaginationDto } from './dto';
import { Profile } from './profile.entity';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(current: number, pageSize: number, query: UserPaginationDto) {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .select(['user.id', 'user.username', 'profile'])
      .where('user.username like :username', {
        username: `%${query.username}%`,
      })
      .andWhere('profile.address like :address', {
        address: `%${query.address}%`,
      })
      .skip((current - 1) * pageSize)
      .take(pageSize)
      .getMany();
  }

  async find(id: number) {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile', 'profile.photo = :photo', {
        photo: '2',
      })
      .where('user.id = :id', { id })
      .select(['user.id', 'user.username', 'profile'])
      .getOne();
  }

  async create(createUserDto: CreateUserDto) {
    return await this.userRepository.save(createUserDto);
  }
}
