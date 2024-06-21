import { Schedule } from './schedule.entity';
import { ScheduleTimeSlotStatus } from '../schedule.enums';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class TimeSlot {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Schedule, (schedule) => schedule.id)
  schedule: Schedule;

  @Column()
  date: Date;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @Column({ type: 'enum', enum: ScheduleTimeSlotStatus, default: ScheduleTimeSlotStatus.AVAILABLE })
  status: ScheduleTimeSlotStatus;

  @Index()
  @Column({ nullable: true })
  merchantId: string;

  @ManyToOne(() => User, { cascade: false })
  @JoinColumn({ name: 'merchantId' })
  merchant: User;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
