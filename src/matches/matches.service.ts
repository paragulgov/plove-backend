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
import { StatisticsService } from '../statistics/statistics.service';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(MatchEntity)
    private matchesRepository: Repository<MatchEntity>,
    private readonly tournamentsService: TournamentsService,
    private readonly betsService: BetsService,
    private readonly statisticsService: StatisticsService,
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

    const match = await this.matchesRepository.findOne(dto.matchId, {
      relations: ['tournament'],
    });

    const tournamentId = match.tournament.id;

    const statistic = await this.statisticsService.findByUser(
      userId,
      tournamentId,
    );

    if (statistic.length < 1) {
      await this.statisticsService.create({
        tournamentId: tournamentId,
        userId: userId,
      });
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

  async resultMatch(matchId: number, userId: number, dto: ResultMatchDto) {
    await this.matchesRepository.update(matchId, {
      homeTeamGoals: dto.homeTeamGoals,
      awayTeamGoals: dto.awayTeamGoals,
      isFinished: true,
    });

    await this.betsService.calculateBets(matchId, dto);

    const userOutcomeIds = await this.betsService.getUserIdsByMatchOutcome(
      dto.homeTeamGoals,
      dto.awayTeamGoals,
      matchId,
    );

    const userDifferenceIds =
      await this.betsService.getUserIdsByMatchDifference(
        dto.homeTeamGoals,
        dto.awayTeamGoals,
        matchId,
      );

    const userAccurateIds = await this.betsService.getUserIdsByMatchAccurate(
      dto.homeTeamGoals,
      dto.awayTeamGoals,
      matchId,
    );

    const match = await this.matchesRepository.findOne(matchId, {
      relations: ['tournament'],
    });

    userOutcomeIds.map(async (id) => {
      await this.statisticsService.updatePoints(
        id,
        match.tournament.id,
        'outcome',
      );
    });

    userDifferenceIds.map(async (id) => {
      await this.statisticsService.updatePoints(
        id,
        match.tournament.id,
        'difference',
      );
    });

    userAccurateIds.map(async (id) => {
      await this.statisticsService.updatePoints(
        id,
        match.tournament.id,
        'accurate',
      );
    });

    const { tournament, ...returnData } = match;

    return returnData;
  }
}
