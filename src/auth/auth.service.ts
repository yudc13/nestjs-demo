import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signin(username: string, password: string) {
    const user = await this.userService.findByNamePwd(username, password);
    if (user && user.password === password) {
      return await this.jwtService.signAsync({
        id: user.id,
        username: user.username,
      });
    }
    return new UnauthorizedException();
  }

  signup(username: string, password: string) {
    return this.userService.create({ username, password } as any);
  }
}
