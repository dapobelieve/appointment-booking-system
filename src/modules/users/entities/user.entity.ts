import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { UserRole, UserStatus } from '../../common/enums/role.enum';
import { Exclude } from 'class-transformer';

@Entity('users')
@Index(['email'], { unique: true })
@Index(['role'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name?: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email?: string;

  @Column({
    type: 'varchar',
    length: 255,
    select: false,
    default: 'PLACEHOLDER_PASSWORD',
  })
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({ type: 'varchar', length: 255 })
  ip: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CUSTOMER })
  role: UserRole;

  /**
   * in order to be able to switch
   * easily between postgres and
   * sqlite for testing I updated
   * the column below to use string type
   * as sqlite does not support enums
   */
  // @Column({ type: 'string', default: UserRole.CUSTOMER })
  // role: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  fcmToken?: string;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  // @Column({ type: 'string', default: UserStatus.ACTIVE })
  // status: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
