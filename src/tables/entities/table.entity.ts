import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TournamentEntity } from '../../tournaments/entities/tournament.entity';

@Entity('tables')
export class TableEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, default: 0 })
  games: number;

  @Column({ nullable: false, default: 0 })
  points: number;

  @OneToOne(() => TournamentEntity, (tournament) => tournament.table)
  tournament: TournamentEntity;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
