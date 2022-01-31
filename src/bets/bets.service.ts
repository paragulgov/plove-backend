import { Injectable } from '@nestjs/common';
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
}
