import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInUserDto } from './dto/signin-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  async signIn(@Body() body: SignInUserDto) {
    const token = await this.authService.signin(body.username, body.password);
    return {
      access_token: token,
    };
  }

  @Post('/signup')
  signUp(@Body() body: SignInUserDto) {
    return this.authService.signup(body.username, body.password);
  }
}
