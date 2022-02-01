import { Injectable } from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MatchEntity } from './entities/match.entity';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(MatchEntity)
    private matchesRepository: Repository<MatchEntity>,
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

  findOne(id: number) {
    return this.matchesRepository.findOne(id, {
      relations: ['tournament', 'bets', 'bets.user'],
    });
  }
}
