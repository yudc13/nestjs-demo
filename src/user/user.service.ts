import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { SignupUserDto } from '../auth/dto/signup-user.dto';
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
    return await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('user.roles', 'role')
      .where('user.id = :id', { id })
      .select(['user.id', 'user.username', 'profile', 'role'])
      .getOne();
  }

  async findByName(username: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :username', { username })
      .getOne();
  }

  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async register(signupUserDto: SignupUserDto) {
    const user = await this.findByName(signupUserDto.username);
    if (user) {
      throw new ForbiddenException('用户已存在');
    }
    const userTmp = await this.userRepository.create(signupUserDto);
    const result = await this.userRepository.save(userTmp);
    return result.id;
  }
}
