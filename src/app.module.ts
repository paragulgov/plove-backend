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
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
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
