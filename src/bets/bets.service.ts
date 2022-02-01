import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBetDto } from './dto/create-bet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BetEntity } from './entities/bet.entity';

@Injectable()
export class BetsService {
  constructor(
    @InjectRepository(BetEntity)
    private betsRepository: Repository<BetEntity>,
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

  findByMatch(matchId: number) {
    if (!matchId) {
      throw new BadRequestException();
    }

    return this.betsRepository.find({
      where: { match: { id: matchId } },
      relations: ['match', 'user'],
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
