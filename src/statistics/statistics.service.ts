import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateStatisticDto } from './dto/create-statistic.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  findByTournament(tournamentId: number) {
    if (!tournamentId) {
      throw new BadRequestException();
    }

    return this.statisticRepository.find({
      where: { tournament: { id: tournamentId } },
      relations: ['user'],
    });
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
      return this.statisticRepository.save({
        id: findStatistic[0].id,
        points: findStatistic[0].points + 1,
        matchOutcome: findStatistic[0].matchOutcome + 1,
      });
    } else if (type === 'difference') {
      return this.statisticRepository.save({
        id: findStatistic[0].id,
        points: findStatistic[0].points + 1,
        goalDifference: findStatistic[0].goalDifference + 1,
      });
    } else if (type === 'accurate') {
      return this.statisticRepository.save({
        id: findStatistic[0].id,
        points: findStatistic[0].points + 1,
        accurateScore: findStatistic[0].accurateScore + 1,
      });
    }
  }
}
