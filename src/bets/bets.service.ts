import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBetDto } from './dto/create-bet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BetEntity } from './entities/bet.entity';
import { FindMatchBetsQuery } from './types';
import { MatchesService } from '../matches/matches.service';

@Injectable()
export class BetsService {
  constructor(
    @InjectRepository(BetEntity)
    private betsRepository: Repository<BetEntity>,
    private readonly matchesService: MatchesService,
  ) {}

  async create(userId: number, dto: CreateBetDto) {
    const guard = await this.betsRepository.find({
      where: { match: { id: dto.matchId }, user: { id: userId } },
    });

    if (guard.length > 0) {
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

    const match = await this.matchesService.findOne(+query.id);

    if (!match) {
      throw new NotFoundException();
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
}
