import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  getUsers() {
    return { code: 0, data: [], msg: 'ok' };
  }
}
