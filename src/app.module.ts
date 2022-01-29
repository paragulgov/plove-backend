import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TournamentsModule } from './tournaments/tournaments.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TournamentEntity } from './tournaments/entities/tournament.entity';
import { MatchesModule } from './matches/matches.module';
import { MatchEntity } from './matches/entities/match.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '896896',
      database: 'plove',
      entities: [TournamentEntity, MatchEntity],
      synchronize: true,
    }),
    TournamentsModule,
    MatchesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
