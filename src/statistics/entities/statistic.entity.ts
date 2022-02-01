import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { TournamentEntity } from '../../tournaments/entities/tournament.entity';

@Entity('statistics')
export class StatisticEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  accurateScore: number;

  @Column({ default: 0 })
  goalDifference: number;

  @Column({ default: 0 })
  matchOutcome: number;

  @Column({ default: 0 })
  points: number;

  @ManyToOne(() => UserEntity, (user) => user.statistics)
  user: UserEntity;

  @ManyToOne(() => TournamentEntity, (tournament) => tournament.statistics)
  tournament: TournamentEntity;
}
