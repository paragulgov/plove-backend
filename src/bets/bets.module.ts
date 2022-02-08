import { Module } from '@nestjs/common';
import { BetsService } from './bets.service';
import { BetsController } from './bets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BetEntity } from './entities/bet.entity';
import { MatchesModule } from '../matches/matches.module';

@Module({
  imports: [MatchesModule, TypeOrmModule.forFeature([BetEntity])],
  controllers: [BetsController],
  providers: [BetsService],
})
export class BetsModule {}
