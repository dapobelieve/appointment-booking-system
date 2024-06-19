import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Index,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Check,
  OneToMany,
} from 'typeorm';
import { ScheduleDefinition } from './schedule-definitions.entity';
import { User } from '../../users/entities/user.entity';
import { TimeSlot } from './time-slots.entity';

@Entity()
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ nullable: true })
  merchantId: string;

  @ManyToOne(() => User, { cascade: false })
  @JoinColumn({ name: 'merchantId' })
  merchant: User;

  @ManyToOne(() => ScheduleDefinition, (scheduleDefinition) => scheduleDefinition.id)
  scheduleDefinition: ScheduleDefinition;

  @OneToMany(() => TimeSlot, (scheduleEntry) => scheduleEntry.schedule, { cascade: true })
  timeslots: TimeSlot[];

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ nullable: true })
  deletedAt: Date;
}
