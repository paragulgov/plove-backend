import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TournamentsModule } from './tournaments/tournaments.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TournamentEntity } from './tournaments/entities/tournament.entity';
import { MatchesModule } from './matches/matches.module';
import { MatchEntity } from './matches/entities/match.entity';
import { UsersModule } from './users/users.module';
import { UserEntity } from './users/entities/user.entity';
import { BetsModule } from './bets/bets.module';
import { BetEntity } from './bets/entities/bet.entity';
import { StatisticsModule } from './statistics/statistics.module';
import { StatisticEntity } from './statistics/entities/statistic.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [
        TournamentEntity,
        MatchEntity,
        UserEntity,
        BetEntity,
        StatisticEntity,
      ],
      synchronize: true,
    }),
    TournamentsModule,
    MatchesModule,
    UsersModule,
    BetsModule,
    StatisticsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
