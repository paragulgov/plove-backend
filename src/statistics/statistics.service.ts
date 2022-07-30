import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateStatisticDto } from './dto/create-statistic.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, getRepository, Repository } from 'typeorm';
import { StatisticEntity } from './entities/statistic.entity';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(StatisticEntity)
    private statisticRepository: Repository<StatisticEntity>,
  ) {}

  create(dto: CreateStatisticDto) {
    return this.statisticRepository.save({
      tournament: { id: dto.tournamentId },
      user: { id: dto.userId },
    });
  }

  findAll() {
    return this.statisticRepository.find({ relations: ['user', 'tournament'] });
  }

  async findByTournament(tournamentId: number) {
    if (!tournamentId) {
      throw new BadRequestException();
    }

    return getRepository(StatisticEntity)
      .createQueryBuilder('statistic')
      .leftJoin('statistic.user', 'user')
      .leftJoin('statistic.tournament', 'tournament')
      .select()
      .addSelect('user.fullName')
      .addSelect('user.vkId')
      .where('tournament.id = :tournamentId', { tournamentId: tournamentId })
      .getRawMany();
  }

  findByUser(userId: number, tournamentId: number) {
    if (!userId) {
      throw new BadRequestException();
    }

    return this.statisticRepository.find({
      where: { tournament: { id: tournamentId }, user: { id: userId } },
      relations: ['user'],
    });
  }

  async updatePoints(
    userId: number,
    tournamentId: number,
    type: 'accurate' | 'outcome' | 'difference',
  ) {
    const findStatistic = await this.findByUser(userId, tournamentId);

    if (type === 'outcome') {
      await getConnection()
        .createQueryBuilder()
        .update(StatisticEntity)
        .set({
          points: () => 'points + 1',
        })
        .where('userId = :userId', { userId: userId })
        .andWhere('tournamentId = :tournamentId', {
          tournamentId: tournamentId,
        })
        .execute();

      return await this.statisticRepository.save({
        id: findStatistic[0].id,
        matchOutcome: findStatistic[0].matchOutcome + 1,
      });
    } else if (type === 'difference') {
      await getConnection()
        .createQueryBuilder()
        .update(StatisticEntity)
        .set({
          points: () => 'points + 1',
        })
        .where('userId = :userId', { userId: userId })
        .andWhere('tournamentId = :tournamentId', {
          tournamentId: tournamentId,
        })
        .execute();

      return await this.statisticRepository.save({
        id: findStatistic[0].id,
        goalDifference: findStatistic[0].goalDifference + 1,
      });
    } else if (type === 'accurate') {
      await getConnection()
        .createQueryBuilder()
        .update(StatisticEntity)
        .set({
          points: () => 'points + 1',
        })
        .where('userId = :userId', { userId: userId })
        .andWhere('tournamentId = :tournamentId', {
          tournamentId: tournamentId,
        })
        .execute();

      return await this.statisticRepository.save({
        id: findStatistic[0].id,
        accurateScore: findStatistic[0].accurateScore + 1,
      });
    }
  }
}
