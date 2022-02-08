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
import { Role } from '../../types/authTypes';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  vkId: number;

  @Column({ nullable: false })
  fullName: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @OneToMany(() => BetEntity, (bet) => bet.user)
  bets: BetEntity[];

  @OneToMany(() => StatisticEntity, (statistic) => statistic.user)
  statistics: StatisticEntity[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
