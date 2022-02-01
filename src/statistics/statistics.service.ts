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
      where: { tournament: { id: tournamentId }, user: { id: 1 } },
      relations: ['user'],
    });
  }
}

// where: { tournament: { id: tournamentId }, user: { id: 1 } },
// relations: ['user'],
