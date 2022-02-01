import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BetEntity } from '../../bets/entities/bet.entity';
import { StatisticEntity } from '../../statistics/entities/statistic.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  fullName: string;

  @Exclude()
  @Column({ unique: true })
  email: string;

  @Column({ default: false })
  isActivated: boolean;

  @OneToMany(() => BetEntity, (bet) => bet.user)
  bets: BetEntity[];

  @OneToMany(() => StatisticEntity, (statistic) => statistic.user)
  statistics: StatisticEntity[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
