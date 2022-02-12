import {
  BadRequestException,
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

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(MatchEntity)
    private matchesRepository: Repository<MatchEntity>,
    private readonly tournamentsService: TournamentsService,
  ) {}

  async create(dto: CreateMatchDto) {
    const match = await this.matchesRepository.save({
      ...dto,
      tournament: { id: dto.tournamentId },
    });

    return this.matchesRepository.findOne(match.id);
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
}
