import { Module } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchEntity } from './entities/match.entity';
import { TournamentsModule } from '../tournaments/tournaments.module';
import { BetsModule } from '../bets/bets.module';
import { StatisticsModule } from '../statistics/statistics.module';

@Module({
  imports: [
    TournamentsModule,
    BetsModule,
    StatisticsModule,
    TypeOrmModule.forFeature([MatchEntity]),
  ],
  controllers: [MatchesController],
  providers: [MatchesService],
  exports: [MatchesService],
})
export class MatchesModule {}
