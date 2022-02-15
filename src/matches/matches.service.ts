import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MatchEntity } from './entities/match.entity';
import { FindTournamentMatchesQuery } from './types';
import { TournamentsService } from '../tournaments/tournaments.service';
import { UpdateMatchDto } from './dto/update-match.dto';
import { ResultMatchDto } from './dto/result-match.dto';
import { BetsService } from '../bets/bets.service';
import { CreateBetDto } from '../bets/dto/create-bet.dto';
import { UpdateBetDto } from '../bets/dto/update-bet.dto';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(MatchEntity)
    private matchesRepository: Repository<MatchEntity>,
    private readonly tournamentsService: TournamentsService,
    private readonly betsService: BetsService,
  ) {}

  async createMatch(dto: CreateMatchDto) {
    const match = await this.matchesRepository.save({
      ...dto,
      tournament: { id: dto.tournamentId },
    });

    return this.matchesRepository.findOne(match.id);
  }

  async createBet(userId: number, dto: CreateBetDto) {
    const checkTime = await this.matchesRepository.findOne(dto.matchId);

    if (new Date(checkTime.betsWillEndAt).getTime() < new Date().getTime()) {
      throw new ForbiddenException();
    }

    return this.betsService.create(userId, dto);
  }

  async updateBet(userId: number, dto: UpdateBetDto) {
    const checkTime = await this.matchesRepository.findOne(dto.matchId);

    if (new Date(checkTime.betsWillEndAt).getTime() < new Date().getTime()) {
      throw new ForbiddenException();
    }

    return this.betsService.updateBet(userId, dto);
  }

  async findMatchesByTournamentId(query: FindTournamentMatchesQuery) {
    if (!query.id) {
      throw new BadRequestException();
    }

    const tournament = await this.tournamentsService.findOne(+query.id);

    if (!tournament) {
      throw new NotFoundException();
    }

    const [data, total] = await this.matchesRepository.findAndCount({
      where: { tournament: { id: +query.id } },
      take: +query.take || 20,
      skip: +query.skip || 0,
      order: { createdAt: 'DESC' },
    });

    return { data, total };
  }

  async findOne(id: number) {
    const match = await this.matchesRepository.findOne(id);

    if (!match) {
      throw new NotFoundException();
    }

    return match;
  }

  async updateMatch(id: number, dto: UpdateMatchDto) {
    await this.matchesRepository.update(id, dto);
    const updatedMatch = await this.matchesRepository.findOne(id);

    if (updatedMatch) {
      return updatedMatch;
    }

    throw new NotFoundException();
  }

  async resultMatch(id: number, dto: ResultMatchDto) {
    await this.matchesRepository.update(id, {
      homeTeamGoals: dto.homeTeamGoals,
      awayTeamGoals: dto.awayTeamGoals,
      isFinished: true,
    });

    await this.betsService.calculateBets(id, dto);

    return { message: 'Матч завершен. Прогнозы посчитаны. Обновите страницу' };
  }
}
