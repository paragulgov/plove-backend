import { Module } from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { TournamentsController } from './tournaments.controller';
import { TournamentEntity } from './entities/tournament.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([TournamentEntity])],
  controllers: [TournamentsController],
  providers: [TournamentsService],
})
export class TournamentsModule {}
