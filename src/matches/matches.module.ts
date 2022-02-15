import { Module } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchEntity } from './entities/match.entity';
import { TournamentsModule } from '../tournaments/tournaments.module';
import { BetsModule } from '../bets/bets.module';

@Module({
  imports: [
    TournamentsModule,
    BetsModule,
    TypeOrmModule.forFeature([MatchEntity]),
  ],
  controllers: [MatchesController],
  providers: [MatchesService],
  exports: [MatchesService],
})
export class MatchesModule {}
