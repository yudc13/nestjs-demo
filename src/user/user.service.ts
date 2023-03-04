import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll() {
    return this.userRepository.find({ select: ['id', 'username'] });
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

  async create(user: User) {
    const u = await this.userRepository.create(user);
    return this.userRepository.save(u);
  }
}
