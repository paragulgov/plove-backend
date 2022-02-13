import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsBoolean } from 'class-validator';
import { TournamentEntity } from '../../tournaments/entities/tournament.entity';
import { BetEntity } from '../../bets/entities/bet.entity';

@Entity('matches')
export class MatchEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  homeTeam: string;

  @Column({ nullable: false })
  awayTeam: string;

  @Column({ default: null })
  homeTeamGoals: null | number;

  @Column({ default: null })
  awayTeamGoals: null | number;

  @Column({ default: false })
  @IsBoolean()
  isFinished: boolean;

  @Column({ type: 'timestamp', nullable: false })
  betsWillEndAt: Date;

  @ManyToOne(() => TournamentEntity, (tournament) => tournament.matches, {
    nullable: false,
  })
  tournament: TournamentEntity;

  @OneToMany(() => BetEntity, (bet) => bet.match)
  bets: BetEntity[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
