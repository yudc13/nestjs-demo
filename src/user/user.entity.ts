import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as argon2 from 'argon2';
import { Logger } from '../logger/logger.entity';
import { Role } from '../role/role.entity';
import { Profile } from './profile.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 50, comment: '用户名', unique: true })
  username: string;
  @Column({ length: 100, comment: '密码' })
  password: string;

  @OneToOne(() => Profile, (profile) => profile.user, {
    cascade: true,
  })
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  @OneToMany(() => Logger, (log) => log.user)
  logs: Logger[];

  @ManyToMany(() => Role, (role) => role.users, { cascade: true })
  @JoinTable({ name: 'users_roles' })
  roles: Role[];

  @BeforeInsert()
  async signPassword() {
    if (this.password) {
      this.password = await argon2.hash(this.password);
    }
  }
}
