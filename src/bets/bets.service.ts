import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBetDto } from './dto/create-bet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BetEntity } from './entities/bet.entity';
import { FindMatchBets } from './types';
import { MatchesService } from '../matches/matches.service';

@Injectable()
export class BetsService {
  constructor(
    @InjectRepository(BetEntity)
    private betsRepository: Repository<BetEntity>,
    private readonly matchesService: MatchesService,
  ) {}

  create(dto: CreateBetDto) {
    return this.betsRepository.save({
      ...dto,
      match: { id: dto.matchId },
      user: { id: 1 },
    });
  }

  findAll() {
    return this.betsRepository.find({ relations: ['match', 'user'] });
  }

  async findByMatch(query: FindMatchBets) {
    if (!query.id) {
      throw new BadRequestException();
    }

    const match = await this.matchesService.findOne(query.id);

    if (!match) {
      throw new NotFoundException();
    }

    return this.betsRepository.find({
      where: { match: { id: query.id } },
      relations: ['user'],
    });
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
}
