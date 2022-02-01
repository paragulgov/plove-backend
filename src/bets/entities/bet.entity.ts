import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { MatchEntity } from '../../matches/entities/match.entity';

@Entity('bets')
export class BetEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  homeTeamGoalsBet: null | number;

  @Column({ default: null })
  awayTeamGoalsBet: null | number;

  @Column({ default: false })
  isFinished: boolean;

  @Column({ default: false })
  accurateScore: boolean;

  @Column({ default: false })
  goalDifference: boolean;

  @Column({ default: false })
  matchOutcome: boolean;

  @Column({ default: 0 })
  points: number;

  @ManyToOne(() => MatchEntity, (match) => match.bets)
  match: MatchEntity;

  @ManyToOne(() => UserEntity, (user) => user.bets)
  user: UserEntity;
}
