import { IntersectionType, OmitType, PartialType } from '@nestjs/mapped-types';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';

export class CreateUserProfileDto {
  @IsNumber()
  gender: number;
  @IsString()
  photo: string;
  @IsString()
  address: string;
}

export class CreateRoleDto {
  @IsString()
  name: string;
}

export class CreateUserDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;

  @IsObject()
  profile?: CreateUserProfileDto;

  @IsArray()
  roles?: CreateRoleDto[];
}

const UserDto = IntersectionType(CreateUserDto, CreateUserProfileDto);

export class UserPaginationDto extends PartialType(UserDto) {}
