import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TimeSlot } from '../../schedules/entities/time-slots.entity';
import { User } from '../../users/entities/user.entity';
import { AppointmentStatuses } from '../appointment.enums';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customerId: string;

  @ManyToOne(() => User, { cascade: false })
  @JoinColumn({ name: 'customerId' })
  customer: User;

  @Index()
  @Column({ nullable: true })
  merchantId: string;

  @ManyToOne(() => User, { cascade: false })
  @JoinColumn({ name: 'merchantId' })
  merchant: User;

  @Index()
  @Column({ nullable: true })
  timeslotId: string;

  @ManyToOne(() => TimeSlot, { nullable: true })
  @JoinColumn({ name: 'timeslotId' })
  timeSlot: TimeSlot;

  @Column({ type: 'enum', enum: AppointmentStatuses, default: AppointmentStatuses.BOOKED })
  status: AppointmentStatuses;

  @Column({ type: 'timestamptz' })
  date: Date;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
