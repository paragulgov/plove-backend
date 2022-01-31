import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { TournamentEntity } from '../../tournaments/entities/tournament.entity';
import { BetEntity } from '../../bets/entities/bet.entity';

@Entity('matches')
export class MatchEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ nullable: false })
  homeTeam: string;

  @ApiProperty()
  @Column({ nullable: false })
  awayTeam: string;

  @ApiProperty({ default: null })
  @Column({ default: null })
  homeTeamGoals: null | number;

  @ApiProperty({ default: null })
  @Column({ default: null })
  awayTeamGoals: null | number;

  @ApiProperty({ default: false })
  @Column({ default: false })
  @IsBoolean()
  isFinished: boolean;

  @ManyToOne(() => TournamentEntity, (tournament) => tournament.matches, {
    nullable: false,
  })
  tournament: TournamentEntity;

  @OneToMany(() => BetEntity, (bet) => bet.match)
  bets: BetEntity[];

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
