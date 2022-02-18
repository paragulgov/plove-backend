import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TournamentsModule } from './tournaments/tournaments.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchesModule } from './matches/matches.module';
import { UsersModule } from './users/users.module';
import { BetsModule } from './bets/bets.module';
import { StatisticsModule } from './statistics/statistics.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseConfig } from './database.config';
import { config } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseConfig,
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
