import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MatchEntity } from '../../matches/entities/match.entity';
import { StatisticEntity } from '../../statistics/entities/statistic.entity';

@Entity('tournaments')
export class TournamentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @OneToMany(() => MatchEntity, (match) => match.tournament)
  matches: MatchEntity[];

  @OneToMany(() => StatisticEntity, (statistic) => statistic.tournament)
  statistics: StatisticEntity[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
