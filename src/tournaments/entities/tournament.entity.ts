import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { MatchEntity } from '../../matches/entities/match.entity';
import { TableEntity } from '../../tables/entities/table.entity';

@Entity('tournaments')
export class TournamentEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ nullable: false })
  name: string;

  @OneToMany(() => MatchEntity, (match) => match.tournament)
  matches: MatchEntity[];

  @OneToOne(() => TableEntity)
  @JoinColumn()
  table: TableEntity;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
