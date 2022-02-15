import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateBetDto } from './dto/create-bet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BetEntity } from './entities/bet.entity';
import { FindMatchBetsQuery } from './types';
import { getConnection } from 'typeorm';
import { ResultMatchDto } from '../matches/dto/result-match.dto';
import { UpdateBetDto } from './dto/update-bet.dto';

@Injectable()
export class BetsService {
  constructor(
    @InjectRepository(BetEntity)
    private betsRepository: Repository<BetEntity>,
  ) {}

  async create(userId: number, dto: CreateBetDto) {
    const haveUserBet = await this.betsRepository.find({
      where: { match: { id: dto.matchId }, user: { id: userId } },
    });

    if (haveUserBet.length > 0) {
      throw new ForbiddenException();
    }

    const created = await this.betsRepository.save({
      ...dto,
      match: { id: dto.matchId },
      user: { id: userId },
    });

    if (!created) {
      throw new BadRequestException();
    }

    return this.betsRepository.findOne(created.id, { relations: ['user'] });
  }

  async checkAccess(userId: number, matchId: number) {
    const find = await this.betsRepository.find({
      where: { match: { id: matchId }, user: { id: userId } },
    });

    if (find.length > 0) {
      return { access: false };
    } else {
      return { access: true };
    }
  }

  async findByMatch(query: FindMatchBetsQuery) {
    if (!query.id) {
      throw new BadRequestException();
    }

    const [data, total] = await this.betsRepository.findAndCount({
      where: { match: { id: +query.id } },
      take: +query.take || 30,
      skip: +query.skip || 0,
      relations: ['user'],
      order: { updatedAt: 'DESC' },
    });

    return { data, total };
  }

  findByUser(userId: number) {
    if (!userId) {
      throw new BadRequestException();
    }

    return this.betsRepository.find({
      where: { user: { id: userId } },
      relations: ['match'],
    });
  }

  async updateBet(userId: number, dto: UpdateBetDto) {
    return getConnection()
      .createQueryBuilder()
      .update(BetEntity)
      .set({
        homeTeamGoalsBet: dto.homeTeamGoalsBet,
        awayTeamGoalsBet: dto.awayTeamGoalsBet,
      })
      .where('matchId = :matchId', { matchId: dto.matchId })
      .andWhere('userId = :userId', { userId: userId })
      .execute();
  }

  async calculateBets(matchId: number, dto: ResultMatchDto) {
    const { homeTeamGoals, awayTeamGoals } = dto;

    await getConnection()
      .createQueryBuilder()
      .update(BetEntity)
      .set({
        isFinished: true,
      })
      .where('matchId = :matchId', { matchId })

      .execute();

    if (homeTeamGoals > awayTeamGoals) {
      const difference = homeTeamGoals - awayTeamGoals;

      await getConnection()
        .createQueryBuilder()
        .update(BetEntity)
        .set({
          matchOutcome: true,
          points: 1,
        })
        .where('matchId = :matchId', { matchId })
        .andWhere('homeTeamGoalsBet > awayTeamGoalsBet')
        .execute();

      await getConnection()
        .createQueryBuilder()
        .update(BetEntity)
        .set({
          matchOutcome: true,
          goalDifference: true,
          points: 2,
        })
        .where('matchId = :matchId', { matchId })
        .andWhere('homeTeamGoalsBet - awayTeamGoalsBet = :difference', {
          difference,
        })
        .execute();

      await getConnection()
        .createQueryBuilder()
        .update(BetEntity)
        .set({
          matchOutcome: true,
          goalDifference: true,
          accurateScore: true,
          points: 3,
        })
        .where('matchId = :matchId', { matchId })
        .andWhere('homeTeamGoalsBet = :homeTeamGoals', {
          homeTeamGoals,
        })
        .andWhere('awayTeamGoalsBet = :awayTeamGoals', {
          awayTeamGoals,
        })
        .execute();
    } else if (homeTeamGoals < awayTeamGoals) {
      const difference = awayTeamGoals - homeTeamGoals;

      await getConnection()
        .createQueryBuilder()
        .update(BetEntity)
        .set({
          matchOutcome: true,
          points: 1,
        })
        .where('matchId = :matchId', { matchId })
        .andWhere('homeTeamGoalsBet < awayTeamGoalsBet')
        .execute();

      await getConnection()
        .createQueryBuilder()
        .update(BetEntity)
        .set({
          matchOutcome: true,
          goalDifference: true,
          points: 2,
        })
        .where('matchId = :matchId', { matchId })
        .andWhere('awayTeamGoalsBet - homeTeamGoalsBet = :difference', {
          difference,
        })
        .execute();

      await getConnection()
        .createQueryBuilder()
        .update(BetEntity)
        .set({
          matchOutcome: true,
          goalDifference: true,
          accurateScore: true,
          points: 3,
        })
        .where('matchId = :matchId', { matchId })
        .andWhere('homeTeamGoalsBet = :homeTeamGoals', {
          homeTeamGoals,
        })
        .andWhere('awayTeamGoalsBet = :awayTeamGoals', {
          awayTeamGoals,
        })
        .execute();
    } else {
      await getConnection()
        .createQueryBuilder()
        .update(BetEntity)
        .set({
          matchOutcome: true,
          points: 1,
        })
        .where('matchId = :matchId', { matchId })
        .andWhere('homeTeamGoalsBet = awayTeamGoalsBet')
        .execute();

      await getConnection()
        .createQueryBuilder()
        .update(BetEntity)
        .set({
          matchOutcome: true,
          goalDifference: true,
          points: 2,
        })
        .where('matchId = :matchId', { matchId })
        .andWhere('awayTeamGoalsBet - homeTeamGoalsBet = 0')
        .execute();

      await getConnection()
        .createQueryBuilder()
        .update(BetEntity)
        .set({
          matchOutcome: true,
          goalDifference: true,
          accurateScore: true,
          points: 3,
        })
        .where('matchId = :matchId', { matchId })
        .andWhere('homeTeamGoalsBet = :homeTeamGoals', {
          homeTeamGoals,
        })
        .andWhere('awayTeamGoalsBet = :awayTeamGoals', {
          awayTeamGoals,
        })
        .execute();
    }
  }
}
