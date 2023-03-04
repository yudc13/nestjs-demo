import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Logger } from '../logger/logger.entity';
import { Role } from '../role/role.entity';
import { Profile } from './profile.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 50, comment: '用户名' })
  username: string;
  @Column({ length: 100, comment: '密码' })
  password: string;

  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;

  @OneToMany(() => Logger, (log) => log.user)
  logs: Logger[];

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({ name: 'users_roles' })
  roles: Role[];
}
