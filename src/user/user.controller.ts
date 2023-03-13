import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Inject,
  Logger,
  LoggerService,
  Param,
  Post,
  Query,
  Req,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AdminGuard } from '../guards/admin.guard';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { User } from './user.entity';
import { CreateUserDto, UserPaginationDto } from './dto';

@Controller('user')
export class UserController {
  // private logger = new Logger(UserController.name);

  constructor(
    private userService: UserService,
    private configService: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private logger: LoggerService,
  ) {
    this.logger.warn('123', UserService.name);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  getUsers(
    @Query('current', new DefaultValuePipe(1)) current: number,
    @Query('pageSize', new DefaultValuePipe(5)) pageSize: number,
    @Query() params: UserPaginationDto,
  ) {
    console.log(current, pageSize, params);
    return this.userService.findAll(current, pageSize, params);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async getUser(@Param('id') id: number) {
    return await this.userService.find(id);
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    const result = await this.userService.create(createUserDto);
    return result.id;
  }
}
