import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MatchEntity } from './entities/match.entity';
import { FindTournamentMatches } from './types';
import { TournamentsService } from '../tournaments/tournaments.service';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(MatchEntity)
    private matchesRepository: Repository<MatchEntity>,
    private readonly tournamentsService: TournamentsService,
  ) {}

  create(dto: CreateMatchDto) {
    return this.matchesRepository.save({
      ...dto,
      tournament: { id: dto.tournamentId },
    });
  }

  findAll() {
    return this.matchesRepository.find({
      relations: ['tournament'],
    });
  }

  async findMatchesByTournamentId(query: FindTournamentMatches) {
    if (!query.id) {
      throw new BadRequestException();
    }

    const tournament = await this.tournamentsService.findOne(+query.id);

    if (!tournament) {
      throw new NotFoundException();
    }

    const [data, total] = await this.matchesRepository.findAndCount({
      where: { tournament: { id: +query.id } },
      relations: ['tournament'],
      take: +query.take || 20,
      skip: +query.skip || 0,
    });

    return { data, total };
  }

  findOne(id: number) {
    return this.matchesRepository.findOne(id, {
      relations: ['tournament', 'bets', 'bets.user'],
    });
  }
}
