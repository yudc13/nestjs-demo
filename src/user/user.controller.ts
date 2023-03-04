import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { User } from './user.entity';
import { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  @Get()
  getUsers() {
    return this.userService.findAll();
  }

  @Get(':id')
  getUser(@Param() params) {
    return this.userService.find(params.id);
  }

  @Post()
  async createUser(@Body() body: Record<string, any>) {
    const user = body as User;
    const result = await this.userService.create(user);
    return result.id;
  }
}
